import { createpayment } from "../services/paymentService.js";

async function createPaymentHandler(req, res) {
    try {
        const userId = req.user.id;
        const { subscription_id, payment_method, idempotency_key } = req.body;

        const result = await createpayment({
            userId,
            subscriptionId: subscription_id,
            paymentMethod: payment_method,
            idempotencyKey: idempotency_key
        });

        res.status(201).json({
            message: "Payment processed",
            payment: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export {
    createPaymentHandler
};
