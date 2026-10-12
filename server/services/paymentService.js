import { createPayment, updatePaymentStatus, getPaymentByIdempotencyKey } from "../models/Payment.js";
import { getSubscriptionById, getSubscriptionByIdForUpdate, activateSubscription } from "../models/Subscription.js";
import { getPlanById } from "../models/SubscriptionPlan.js";
import pool from "../config/db.js";

export async function createpayment({ userId, subscriptionId, paymentMethod, idempotencyKey }) {
    const parsedSubscriptionId = Number(subscriptionId);
    if (!Number.isInteger(parsedSubscriptionId) || parsedSubscriptionId <= 0) {
        throw { statusCode: 400, message: "Invalid or missing subscription ID" };
    }
    
    if (!paymentMethod || !idempotencyKey) {
        throw { statusCode: 400, message: "Missing payment method or idempotency key" };
    }

    // 1. Check if the user already submitted a payment with this idempotency key
    const existing = await getPaymentByIdempotencyKey(userId, idempotencyKey);
    if (existing) {
        if (Number(existing.subscription_id) !== parsedSubscriptionId || existing.payment_method !== paymentMethod) {
            throw { statusCode: 400, message: "Idempotency key already used for a different request" };
        }
        if (existing.status !== 'pending') {
            return existing;
        }
        throw { statusCode: 409, message: "Payment is currently processing" };
    }

    // 2. Validate subscription exists, belongs to user, and is pending
    const subscription = await getSubscriptionById(parsedSubscriptionId);
    if (!subscription || Number(subscription.user_id) !== Number(userId) || subscription.status !== 'pending') {
        throw { statusCode: 400, message: "Invalid, unauthorized, or non-pending subscription" };
    }

    // 3. Fetch plan price and currency directly from the database
    const plan = await getPlanById(subscription.plan_id);
    if (!plan || !plan.is_active) {
        throw { statusCode: 400, message: "Associated plan is no longer available or inactive" };
    }
    const amount = plan.price;
    const currency = plan.currency;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 4. Insert payment record (ON CONFLICT DO NOTHING avoids duplicate payments without hardcoded error codes)
        const payment = await createPayment(
            { userId, subscriptionId: parsedSubscriptionId, idempotencyKey, amount, currency, paymentMethod },
            client
        );

        // If insert returned nothing, a concurrent request inserted this key first
        if (!payment) {
            const dupPayment = await getPaymentByIdempotencyKey(userId, idempotencyKey, client);
            if (dupPayment) {
                if (Number(dupPayment.subscription_id) !== parsedSubscriptionId || dupPayment.payment_method !== paymentMethod) {
                    throw { statusCode: 400, message: "Idempotency key already used for a different request" };
                }
                if (dupPayment.status !== 'pending') {
                    await client.query('ROLLBACK');
                    return dupPayment;
                }
            }
            throw { statusCode: 409, message: "Payment is currently processing" };
        }

        // 5. Row-lock subscription to prevent concurrent activation from different requests
        const lockedSub = await getSubscriptionByIdForUpdate(parsedSubscriptionId, client);
        if (!lockedSub || lockedSub.status !== 'pending') {
            throw { statusCode: 400, message: "Subscription is no longer pending or is invalid" };
        }

        // 6. Simulate payment processing (test gateway)
        const simulatedStatus = "succeeded";
        const mockReference = "mock_tx_" + Date.now();

        const updatedPayment = await updatePaymentStatus(payment.id, simulatedStatus, mockReference, client);

        // 7. If payment succeeded, calculate expiry and activate subscription
        if (simulatedStatus === 'succeeded') {
            const startsAt = new Date();
            let expiresAt = new Date(startsAt);
            
            if (plan.billing_period === 'monthly') {
                expiresAt.setUTCMonth(expiresAt.getUTCMonth() + 1);
                if (expiresAt.getUTCDate() < startsAt.getUTCDate()) {
                    expiresAt.setUTCDate(0);
                }
            } else if (plan.billing_period === 'yearly') {
                expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);
                if (startsAt.getUTCMonth() === 1 && startsAt.getUTCDate() === 29) {
                    expiresAt.setUTCDate(0);
                }
            } else if (plan.billing_period === 'lifetime') {
                expiresAt = null;
            }

            // Deactivate any previously active subscription for this user
            await client.query(
                `UPDATE subscriptions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND status = 'active' AND id != $2;`,
                [userId, parsedSubscriptionId]
            );

            await activateSubscription(parsedSubscriptionId, startsAt, expiresAt, client);
        }

        await client.query('COMMIT');
        return updatedPayment;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function updatepaymentstatus(paymentId, status, paymentReference) {
    return await updatePaymentStatus(paymentId, status, paymentReference);
}