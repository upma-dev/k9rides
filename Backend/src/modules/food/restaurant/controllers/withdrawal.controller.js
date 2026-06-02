import { sendResponse, sendError } from '../../../../utils/response.js';
import { FoodRestaurantWithdrawal } from '../models/foodRestaurantWithdrawal.model.js';
import { FoodRestaurant } from '../models/restaurant.model.js';
import { getRestaurantFinance } from '../services/restaurantFinance.service.js';

export const createWithdrawalRequestController = async (req, res, next) => {
    try {
        const restaurantId = req.user?.userId;
        const { amount, bankDetails } = req.body;

        if (!restaurantId) return sendError(res, 401, 'Restaurant authentication required');
        if (!amount || amount <= 0) return sendError(res, 400, 'Invalid withdrawal amount');

        // Check if restaurant has enough balance
        const finance = await getRestaurantFinance(restaurantId);
        const totalEarnings = Number(finance?.currentCycle?.netAvailable ?? finance?.currentCycle?.estimatedPayout ?? 0);

        if (amount > totalEarnings) {
            return sendError(res, 400, `Insufficient balance. Available to withdraw: ₹${totalEarnings.toLocaleString('en-IN')}`);
        }

        // Create the withdrawal request
        const withdrawal = new FoodRestaurantWithdrawal({
            restaurantId,
            amount: Number(amount),
            bankDetails,
            status: 'pending'
        });

        await withdrawal.save();

        return sendResponse(res, 201, 'Withdrawal request submitted successfully', withdrawal);
    } catch (error) {
        next(error);
    }
};

export const listMyWithdrawalsController = async (req, res, next) => {
    try {
        const restaurantId = req.user?.userId;
        if (!restaurantId) return sendError(res, 401, 'Restaurant authentication required');

        const withdrawals = await FoodRestaurantWithdrawal.find({ restaurantId })
            .sort({ createdAt: -1 })
            .lean();

        return sendResponse(res, 200, 'Withdrawals fetched successfully', withdrawals);
    } catch (error) {
        next(error);
    }
};
