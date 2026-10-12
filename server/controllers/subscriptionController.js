import { initiateSubscriptionPurchase, getCurrentSubscription, cancelCurrentSubscription, cancelSubscriptionById } from "../services/subscriptionService.js";

async function createSubscriptionHandler(req, res) {
    try {
        const userId = req.user.id;
        const { plan_id } = req.body;

        const result = await initiateSubscriptionPurchase(userId, plan_id);
        res.status(201).json({
            message: "Subscription purchase initiated",
            data: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

async function getMySubscriptionHandler(req, res) {
    try {
        const userId = req.user.id;
        const subscription = await getCurrentSubscription(userId);
        
        if (!subscription) {
            return res.status(200).json({ data: null, message: "No active subscription found" });
        }
        
        res.status(200).json({ data: subscription });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

async function cancelMySubscriptionHandler(req, res) {
    try {
        const userId = req.user.id;
        const cancelledSub = await cancelCurrentSubscription(userId);
        
        res.status(200).json({
            message: "Subscription cancelled successfully",
            data: cancelledSub
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

async function cancelSubscriptionByIdHandler(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        if (id === 'me') {
            const cancelledSub = await cancelCurrentSubscription(userId);
            return res.status(200).json({
                message: "Subscription cancelled successfully",
                data: cancelledSub
            });
        }
        const cancelledSub = await cancelSubscriptionById(userId, id);
        res.status(200).json({
            message: "Subscription cancelled successfully",
            data: cancelledSub
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export {
    createSubscriptionHandler,
    getMySubscriptionHandler,
    cancelMySubscriptionHandler,
    cancelSubscriptionByIdHandler
};
