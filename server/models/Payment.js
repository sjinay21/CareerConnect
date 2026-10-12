import pool from "../config/db.js";

async function createPayment({userId,subscriptionId,idempotencyKey,amount,currency,paymentMethod}, client = pool) {
    const result = await client.query(
        `INSERT INTO payments (user_id, subscription_id, idempotency_key, amount, currency, payment_method, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
        ON CONFLICT (user_id, idempotency_key) DO NOTHING
        RETURNING *;`,
        [userId, subscriptionId, idempotencyKey, amount, currency, paymentMethod]
    );
    return result.rows[0];
}

async function updatePaymentStatus(paymentId, status, paymentReference, client = pool) {
    const result = await client.query(
        `UPDATE payments SET status = $1,payment_reference = $2,updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *;`,
        [status, paymentReference, paymentId]
    );

    return result.rows[0];
}
async function getPaymentByIdempotencyKey(userId, idempotencyKey, client = pool) {
    const result = await client.query(
        `SELECT * FROM payments WHERE user_id = $1 AND idempotency_key = $2;`,
        [userId, idempotencyKey]
    );
    return result.rows[0];
}

export {createPayment, updatePaymentStatus, getPaymentByIdempotencyKey};