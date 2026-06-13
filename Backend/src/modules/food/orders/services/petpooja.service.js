import mongoose from 'mongoose';
import fetch from 'node-fetch';
import { FoodOrder } from '../models/order.model.js';
import { FoodRestaurant } from '../../restaurant/models/restaurant.model.js';
import { FoodPetpoojaSyncLog } from '../models/foodPetpoojaSyncLog.model.js';
import { logger } from '../../../../utils/logger.js';
import { config } from '../../../../config/env.js';
import { addOrderJob } from '../../../../queues/producers/order.producer.js';


/**
 * Checks if Petpooja is enabled globally and for the specific restaurant.
 * Returns the restaurant configuration if active.
 * @param {string} restaurantId 
 * @returns {Promise<object|null>}
 */
async function getActiveRestaurantConfig(restaurantId) {
    if (!config.petpoojaEnabled) {
        return null;
    }
    try {
        const restaurant = await FoodRestaurant.findById(restaurantId)
            .select('petpoojaEnabled petpoojaOutletId restaurantName')
            .lean();
        if (!restaurant || !restaurant.petpoojaEnabled || !restaurant.petpoojaOutletId) {
            return null;
        }
        return restaurant;
    } catch (err) {
        logger.error(`Error resolving Petpooja config for restaurant ${restaurantId}: ${err.message}`);
        return null;
    }
}

/**
 * Builds standard Petpooja POST request headers.
 * @returns {object}
 */
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'app-key': config.petpoojaApiKey,
        'client-code': config.petpoojaClientCode
    };
}

/**
 * Pushes order details to Petpooja POS system.
 * Run asynchronously in background. Never blocks core flows.
 * @param {string} orderMongoId 
 */
export async function pushOrderToPetpooja(orderMongoId) {
    let syncLog = null;
    try {
        const order = await FoodOrder.findById(orderMongoId).lean();
        if (!order) {
            logger.warn(`[Petpooja] Sync aborted: Order ${orderMongoId} not found.`);
            return;
        }

        const restConfig = await getActiveRestaurantConfig(order.restaurantId);
        if (!restConfig) {
            logger.debug(`[Petpooja] Sync skipped: Petpooja disabled for restaurant ${order.restaurantId} or globally.`);
            return;
        }

        // Upsert sync log to prevent concurrent / duplicate attempts
        syncLog = await FoodPetpoojaSyncLog.findOneAndUpdate(
            { orderId: order._id },
            { 
                $setOnInsert: { 
                    orderId: order._id, 
                    restaurantId: order.restaurantId,
                    status: 'pending'
                }
            },
            { upsert: true, new: true }
        );

        if (syncLog.status === 'success') {
            logger.info(`[Petpooja] Order ${order.order_id} already synced successfully.`);
            return;
        }

        syncLog.attempts += 1;
        syncLog.lastAttemptAt = new Date();

        // Build Petpooja Payload
        const payload = {
            app_key: config.petpoojaApiKey,
            client_code: config.petpoojaClientCode,
            outlet_code: restConfig.petpoojaOutletId,
            primary: {
                order_id: order.order_id || order._id.toString(),
                outlet_code: restConfig.petpoojaOutletId,
                payment_type: order.payment?.method === 'cash' ? 'COD' : 'Prepaid',
                delivery_charge: order.pricing?.deliveryFee || 0,
                discount: order.pricing?.discount || 0,
                tax: order.pricing?.tax || 0,
                total: order.pricing?.total || 0,
                subtotal: order.pricing?.subtotal || 0,
                packaging_charge: order.pricing?.packagingFee || 0,
                platform_fee: order.pricing?.platformFee || 0,
                order_source: 'K9 Rides',
                order_time: order.createdAt
            },
            customer: {
                name: order.customerName || 'Customer',
                phone: order.customerPhone || '',
                address: order.deliveryAddress?.street || '',
                city: order.deliveryAddress?.city || '',
                state: order.deliveryAddress?.state || '',
                pincode: order.deliveryAddress?.zipCode || ''
            },
            items: (order.items || []).map(item => ({
                item_id: item.itemId, // Falls back to internal code or mapped petpoojaItemId
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                variant_id: item.variantId || '',
                variant_name: item.variantName || '',
                notes: item.notes || ''
            }))
        };

        syncLog.payloadSent = payload;

        // Perform request
        const url = `${config.petpoojaApiUrl.replace(/\/$/, '')}/SaveOrder`;
        logger.info(`[Petpooja] Pushing order ${order.order_id} to POS URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
            timeout: 15000 // 15 seconds timeout
        });

        const resText = await response.text();
        let resJson = null;
        try {
            resJson = JSON.parse(resText);
        } catch (_) {
            // Raw text response if not JSON
            resJson = { rawResponse: resText };
        }

        syncLog.responseReceived = resJson;

        if (response.status === 200 && (resJson.success === true || resJson.status === 'success' || resJson.success === '1')) {
            syncLog.status = 'success';
            syncLog.petpoojaOrderId = resJson.petpooja_order_id || resJson.order_id || '';
            syncLog.error = '';
            logger.info(`[Petpooja] Order ${order.order_id} synced successfully. Petpooja ID: ${syncLog.petpoojaOrderId}`);
        } else {
            // Check for specific duplicate order errors
            const isDuplicate = resText.toLowerCase().includes('duplicate') || 
                                (resJson.message && resJson.message.toLowerCase().includes('duplicate'));

            if (isDuplicate) {
                syncLog.status = 'success';
                syncLog.error = 'Marked success: Duplicate order detected on POS';
                logger.info(`[Petpooja] Order ${order.order_id} already exists on POS. Marking success.`);
            } else {
                syncLog.status = 'failed';
                syncLog.error = resJson.message || `HTTP ${response.status} - ${resText.slice(0, 200)}`;
                logger.warn(`[Petpooja] Sync failed for order ${order.order_id}: ${syncLog.error}`);
            }
        }

        await syncLog.save();

    } catch (err) {
        logger.error(`[Petpooja] Error syncing order ${orderMongoId}: ${err.message}`, { stack: err.stack });
        if (syncLog) {
            syncLog.status = 'failed';
            syncLog.error = err.message;
            await syncLog.save().catch(e => logger.error(`[Petpooja] Failed to update syncLog error state: ${e.message}`));
        }
        // Throw so BullMQ processor knows it failed and can retry
        throw err;
    }
}

/**
 * Synchronizes order status transitions from K9 rides to Petpooja.
 * @param {string} orderMongoId 
 * @param {string} status - New K9 status
 */
export async function updateOrderStatusInPetpooja(orderMongoId, status) {
    try {
        const order = await FoodOrder.findById(orderMongoId).lean();
        if (!order) return;

        const restConfig = await getActiveRestaurantConfig(order.restaurantId);
        if (!restConfig) return;

        // Fetch sync log to see if it was pushed successfully
        const log = await FoodPetpoojaSyncLog.findOne({ orderId: order._id }).lean();
        if (!log || log.status !== 'success') {
            logger.warn(`[Petpooja] Status sync skipped: Order ${order.order_id} was not successfully pushed to POS yet.`);
            return;
        }

        // Map K9 orderStatus to Petpooja order statuses
        // Petpooja typical statuses: 'dispatched' (out for delivery), 'completed' (delivered), 'cancelled' (cancelled)
        let petpoojaStatus = '';
        if (status === 'picked_up') {
            petpoojaStatus = 'dispatched';
        } else if (status === 'delivered') {
            petpoojaStatus = 'completed';
        } else if (status.startsWith('cancelled')) {
            petpoojaStatus = 'cancelled';
        }

        if (!petpoojaStatus) {
            // Unmapped status: skip
            return;
        }

        const payload = {
            app_key: config.petpoojaApiKey,
            client_code: config.petpoojaClientCode,
            outlet_code: restConfig.petpoojaOutletId,
            order_id: order.order_id || order._id.toString(),
            petpooja_order_id: log.petpoojaOrderId || '',
            status: petpoojaStatus,
            cancel_reason: order.statusHistory?.slice(-1)[0]?.note || ''
        };

        const url = `${config.petpoojaApiUrl.replace(/\/$/, '')}/UpdateOrderStatus`;
        logger.info(`[Petpooja] Updating order ${order.order_id} status on POS to '${petpoojaStatus}'`);

        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
            timeout: 10000
        });

        const resText = await response.text();
        logger.info(`[Petpooja] Status update response: HTTP ${response.status} - ${resText}`);

    } catch (err) {
        logger.error(`[Petpooja] Error updating status for order ${orderMongoId} to ${status}: ${err.message}`);
    }
}

/**
 * Lists all Petpooja synchronization logs with pagination and filters.
 * @param {object} query 
 * @returns {Promise<object>}
 */
export async function listPetpoojaSyncLogs(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.status) {
        filter.status = query.status;
    }
    if (query.restaurantId) {
        filter.restaurantId = new mongoose.Types.ObjectId(query.restaurantId);
    }
    if (query.orderId) {
        const rawId = String(query.orderId).trim();
        if (mongoose.isValidObjectId(rawId)) {
            filter.orderId = new mongoose.Types.ObjectId(rawId);
        } else {
            const matchedOrders = await FoodOrder.find({
                $or: [{ order_id: rawId }, { orderId: rawId }]
            }).select('_id').lean();
            filter.orderId = { $in: matchedOrders.map(o => o._id) };
        }
    }

    const [docs, total] = await Promise.all([
        FoodPetpoojaSyncLog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('orderId', 'order_id pricing total orderStatus')
            .populate('restaurantId', 'restaurantName')
            .lean(),
        FoodPetpoojaSyncLog.countDocuments(filter)
    ]);

    return {
        docs,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
    };
}

/**
 * Triggers a manual retry of a failed Petpooja synchronization log.
 * @param {string} logId 
 * @returns {Promise<object>}
 */
export async function retryPetpoojaSyncLog(logId) {
    if (!logId || !mongoose.isValidObjectId(logId)) {
        throw new Error('Invalid log ID');
    }

    const log = await FoodPetpoojaSyncLog.findById(logId);
    if (!log) {
        throw new Error('Sync log not found');
    }

    if (log.status === 'success') {
        return { success: true, message: 'Already synced successfully' };
    }

    // Reset attempts and set status back to pending
    log.status = 'pending';
    log.attempts = 0;
    log.error = 'Manually retried';
    await log.save();

    // Enqueue BullMQ job immediately
    await addOrderJob({
        action: 'PETPOOJA_ORDER_PUSH',
        orderMongoId: log.orderId.toString()
    });

    return { success: true, message: 'Retry job enqueued successfully' };
}

