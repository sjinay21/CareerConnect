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
        SELECT s.*, 
               p.name as plan_name, 
               p.description as plan_description, 
               p.price as plan_price, 
               p.currency as plan_currency, 
               p.billing_period as plan_billing_period
        FROM subscriptions s
        JOIN subscription_plans p ON s.plan_id = p.id
        WHERE s.user_id = $1 
          AND s.status = 'active'
          AND (s.expires_at IS NULL OR s.expires_at > CURRENT_TIMESTAMP)
        ORDER BY s.created_at DESC
        LIMIT 1;
    `;
    let result = await pool.query(query, [userId]);
    let sub = result.rows[0];

    // If user has no active subscription, auto-assign default Free plan from subscription_plans
    if (!sub && userId) {
        const freePlanRes = await pool.query(
            "SELECT * FROM subscription_plans WHERE is_active = TRUE AND (price = 0 OR LOWER(name) = 'free') ORDER BY price ASC LIMIT 1;"
        );
        const freePlan = freePlanRes.rows[0];
        if (freePlan) {
            await pool.query(
                `INSERT INTO subscriptions (user_id, plan_id, status, starts_at, expires_at)
                 VALUES ($1, $2, 'active', CURRENT_TIMESTAMP, NULL);`,
                [userId, freePlan.id]
            );
            result = await pool.query(query, [userId]);
            sub = result.rows[0];
        }
    }

    if (!sub) return null;

    const featuresQuery = `
        SELECT f.id, f.name, f.description, f.is_active
        FROM features f
        JOIN plan_features pf ON f.id = pf.feature_id
        WHERE pf.plan_id = $1
        ORDER BY f.id ASC;
    `;
    const featuresResult = await pool.query(featuresQuery, [sub.plan_id]);
    sub.features = featuresResult.rows;
    sub.plan_features = featuresResult.rows;
    return sub;
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

async function getUserActiveSubscriptionWithFeatures(userId) {
    const query = `
        SELECT s.id,s.user_id,s.plan_id,s.status,s.starts_at,s.expires_at,sp.name AS plan_name,f.id AS feature_id,f.name AS feature_name
        FROM subscriptions s
        JOIN subscription_plans sp ON s.plan_id = sp.id
        LEFT JOIN plan_features pf ON sp.id = pf.plan_id
        LEFT JOIN features f ON pf.feature_id = f.id AND f.is_active = TRUE
        WHERE s.user_id = $1 AND s.status = 'active' AND sp.is_active = TRUE AND (s.expires_at IS NULL OR s.expires_at > CURRENT_TIMESTAMP)
        ORDER BY s.created_at DESC;`;
    let result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
        await getUserActiveSubscription(userId);
        result = await pool.query(query, [userId]);
        if (result.rows.length === 0) {
            return null;
        }
    }

    const first = result.rows[0];
    return {
        id: first.id,
        user_id: first.user_id,
        plan_id: first.plan_id,
        plan_name: first.plan_name,
        status: first.status,
        starts_at: first.starts_at,
        expires_at: first.expires_at,
        features: result.rows.filter(row => row.feature_id !== null).map(row => ({id: row.feature_id,name: row.feature_name}))
    };
}

export {createSubscription,getSubscriptionById,getSubscriptionByIdForUpdate,activateSubscription,getUserActiveSubscription,getUserActiveSubscriptionWithFeatures,cancelSubscription,expireActiveSubscriptions};
