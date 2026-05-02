import { z } from 'zod';
import { ValidationError } from '../../../../core/auth/errors.js';

const rangeSchema = z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    fee: z.number().min(0)
});

const distanceOrderPriceSlabSchema = z.object({
    minOrderValue: z.number().min(0),
    maxOrderValue: z.number().min(0),
    deliveryFee: z.number().min(0),
    isActive: z.boolean().optional()
});

const distanceOrderRuleSchema = z.object({
    distanceRuleId: z.string().min(1),
    priceSlabs: z.array(distanceOrderPriceSlabSchema).optional()
});

const feeSettingsUpsertSchema = z.object({
    deliveryFee: z.number().min(0).nullable().optional(),
    deliveryFeeRanges: z.array(rangeSchema).optional(),
    deliveryFeeComputationMode: z.enum(['order_value_range', 'distance_order_value']).optional(),
    distanceOrderDeliveryFeeRules: z.array(distanceOrderRuleSchema).optional(),
    freeDeliveryThreshold: z.number().min(0).nullable().optional(),
    platformFee: z.number().min(0).nullable().optional(),
    gstRate: z.number().min(0).max(100).nullable().optional(),
    isActive: z.boolean().optional()
});

export const validateFeeSettingsUpsertDto = (body) => {
    const normalized = {
        deliveryFee:
            body?.deliveryFee === null
                ? null
                : body?.deliveryFee !== undefined
                    ? Number(body.deliveryFee)
                    : undefined,
        deliveryFeeRanges: Array.isArray(body?.deliveryFeeRanges)
            ? body.deliveryFeeRanges.map((r) => ({
                min: Number(r?.min),
                max: Number(r?.max),
                fee: Number(r?.fee)
            }))
            : undefined,
        deliveryFeeComputationMode:
            body?.deliveryFeeComputationMode !== undefined
                ? String(body.deliveryFeeComputationMode)
                : undefined,
        distanceOrderDeliveryFeeRules: Array.isArray(body?.distanceOrderDeliveryFeeRules)
            ? body.distanceOrderDeliveryFeeRules.map((rule) => ({
                distanceRuleId: String(rule?.distanceRuleId || ''),
                priceSlabs: Array.isArray(rule?.priceSlabs)
                    ? rule.priceSlabs.map((s) => ({
                        minOrderValue: Number(s?.minOrderValue),
                        maxOrderValue: Number(s?.maxOrderValue),
                        deliveryFee: Number(s?.deliveryFee),
                        isActive: s?.isActive !== undefined ? Boolean(s.isActive) : true
                    }))
                    : []
            }))
            : undefined,
        freeDeliveryThreshold:
            body?.freeDeliveryThreshold === null
                ? null
                : body?.freeDeliveryThreshold !== undefined
                    ? Number(body.freeDeliveryThreshold)
                    : undefined,
        platformFee:
            body?.platformFee === null ? null : body?.platformFee !== undefined ? Number(body.platformFee) : undefined,
        gstRate:
            body?.gstRate === null ? null : body?.gstRate !== undefined ? Number(body.gstRate) : undefined,
        isActive: body?.isActive !== undefined ? Boolean(body.isActive) : undefined
    };

    const result = feeSettingsUpsertSchema.safeParse(normalized);
    if (!result.success) {
        throw new ValidationError(result.error.errors[0].message);
    }

    // Validate ranges: min < max, non-overlapping after sorting
    const ranges = Array.isArray(result.data.deliveryFeeRanges) ? result.data.deliveryFeeRanges : undefined;
    if (ranges) {
        const sorted = [...ranges].sort((a, b) => a.min - b.min);
        for (const r of sorted) {
            if (r.min >= r.max) {
                throw new ValidationError('Each range must have min less than max');
            }
        }
        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1];
            const cur = sorted[i];
            if (cur.min < prev.max) {
                throw new ValidationError('Delivery fee ranges must not overlap');
            }
        }
        result.data.deliveryFeeRanges = sorted;
    }

    if (Array.isArray(result.data.distanceOrderDeliveryFeeRules)) {
        const dedupe = new Set();
        for (const rule of result.data.distanceOrderDeliveryFeeRules) {
            if (dedupe.has(rule.distanceRuleId)) {
                throw new ValidationError('Duplicate distanceRuleId found in distance-order fee rules');
            }
            dedupe.add(rule.distanceRuleId);
            const slabs = Array.isArray(rule.priceSlabs) ? [...rule.priceSlabs] : [];
            const sortedSlabs = slabs.sort((a, b) => a.minOrderValue - b.minOrderValue);
            for (const slab of sortedSlabs) {
                if (slab.minOrderValue >= slab.maxOrderValue) {
                    throw new ValidationError('Each price slab must have minOrderValue less than maxOrderValue');
                }
            }
            const activeSlabs = sortedSlabs.filter((s) => s.isActive !== false);
            for (let i = 1; i < activeSlabs.length; i++) {
                const prev = activeSlabs[i - 1];
                const cur = activeSlabs[i];
                if (cur.minOrderValue < prev.maxOrderValue) {
                    throw new ValidationError('Price slabs must not overlap inside a distance slab');
                }
            }
            rule.priceSlabs = sortedSlabs.map((s) => ({
                ...s,
                minOrderValue: Math.round(s.minOrderValue * 100) / 100,
                maxOrderValue: Math.round(s.maxOrderValue * 100) / 100,
                deliveryFee: Math.round(s.deliveryFee * 100) / 100
            }));
        }
    }

    return result.data;
};

