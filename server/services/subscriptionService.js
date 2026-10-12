import { createSubscription, getSubscriptionById, getUserActiveSubscription, cancelSubscription } from "../models/Subscription.js";
import { getPlanById } from "../models/SubscriptionPlan.js";

// Phase 6 B: Establish one clear, reusable way to determine whether a user currently has premium access.
export async function hasPremiumAccess(userId) {
    const activeSub = await getUserActiveSubscription(userId);
    return !!activeSub;
}

export async function getCurrentSubscription(userId) {
    return await getUserActiveSubscription(userId);
}

export async function cancelCurrentSubscription(userId) {
    const activeSub = await getUserActiveSubscription(userId);
    if (!activeSub) {
        throw { statusCode: 404, message: "No active subscription found to cancel" };
    }
    // Phase 6 C: Immediate cancellation ends access immediately (status -> cancelled)
    const cancelled = await cancelSubscription(activeSub.id);
    return cancelled;
}

export async function cancelSubscriptionById(userId, subscriptionId) {
    const subId = Number(subscriptionId);
    if (!Number.isInteger(subId) || subId <= 0) {
        throw { statusCode: 400, message: "Invalid subscription ID" };
    }
    const sub = await getSubscriptionById(subId);
    if (!sub || Number(sub.user_id) !== Number(userId)) {
        throw { statusCode: 404, message: "Subscription not found" };
    }
    if (sub.status !== 'active') {
        throw { statusCode: 400, message: "Only active subscriptions can be cancelled" };
    }
    return await cancelSubscription(subId);
}

async function initiateSubscriptionPurchase(userId, planId) {
    if (!planId || isNaN(parseInt(planId, 10))) {
        throw { statusCode: 400, message: "Invalid or missing subscription ID" };
    }

    // Prevent subscribing again to the exact same active plan
    const activeSub = await getUserActiveSubscription(userId);
    if (activeSub && Number(activeSub.plan_id) == Number(planId)) {
        throw { statusCode: 400, message: "User already has an active subscription to this plan" };
    }

    const plan = await getPlanById(planId);
    if (!plan || !plan.is_active) {
        throw { statusCode: 400, message: "Plan does not exist or is inactive" };
    }

    const subscription = await createSubscription(userId, plan.id);

    return {
        subscription,
        plan: {
            price: plan.price,
            currency: plan.currency
        }
    };
}

export {
    initiateSubscriptionPurchase
};
