import pool from "../config/db.js";
async function createSubscription(userId, planId) {
    const result = await pool.query(`INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($1, $2, 'pending') RETURNING *;`, [userId, planId]);
    return result.rows[0];
}

async function getSubscriptionById(id) {
    const query = `SELECT * FROM subscriptions WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function activateSubscription(id, startsAt, expiresAt, client = pool) {
    const query = `
        UPDATE subscriptions 
        SET status = 'active', starts_at = $2, expires_at = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
    `;
    const result = await client.query(query, [id, startsAt, expiresAt]);
    return result.rows[0];
}
async function getSubscriptionByIdForUpdate(id, client = pool) {
    const query = `SELECT * FROM subscriptions WHERE id = $1 FOR UPDATE;`;
    const result = await client.query(query, [id]);
    return result.rows[0];
}

async function getUserActiveSubscription(userId) {
    const query = `
        SELECT s.*, p.name as plan_name, p.features as plan_features 
        FROM subscriptions s
        JOIN subscription_plans p ON s.plan_id = p.id
        WHERE s.user_id = $1 
          AND s.status = 'active'
          AND (s.expires_at IS NULL OR s.expires_at > CURRENT_TIMESTAMP)
        ORDER BY s.created_at DESC
        LIMIT 1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
}

async function cancelSubscription(id) {
    const query = `
        UPDATE subscriptions 
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function expireActiveSubscriptions() {
    const query = `
        UPDATE subscriptions
        SET status = 'expired', updated_at = CURRENT_TIMESTAMP
        WHERE status = 'active'
          AND expires_at IS NOT NULL
          AND expires_at <= CURRENT_TIMESTAMP
        RETURNING id;
    `;
    const result = await pool.query(query);
    return result.rowCount;
}

export { createSubscription, getSubscriptionById, getSubscriptionByIdForUpdate, activateSubscription, getUserActiveSubscription, cancelSubscription, expireActiveSubscriptions };
