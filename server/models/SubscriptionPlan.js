import pool from "../config/db.js";

async function createPlan({ name, description, features, price, currency, billing_period }) {
    const result = await pool.query(`
        INSERT INTO subscription_plans (name, description, features, price, currency, billing_period)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
    `, [name, description, features, price, currency, billing_period]);
    return result.rows[0];
}

async function updatePlan(id, { name, description, features, price, currency, billing_period }) {
    const result = await pool.query(`
        UPDATE subscription_plans
        SET name = $1, description = $2, features = $3, price = $4, currency = $5, billing_period = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *;
    `, [name, description, features, price, currency, billing_period, id]);
    return result.rows[0];
}

async function getPlanById(id) {
    const result = await pool.query(`SELECT * FROM subscription_plans WHERE id = $1;`, [id]);
    return result.rows[0];
}

async function getPlanByName(name) {
    const result = await pool.query(`SELECT * FROM subscription_plans WHERE name = $1;`, [name]);
    return result.rows[0];
}

async function getActivePlans() {
    const result = await pool.query(`SELECT id, name, description, features, price, currency, billing_period FROM subscription_plans WHERE is_active = TRUE ORDER BY id ASC;`);
    return result.rows;
}

async function deactivatePlan(id) {
    const result = await pool.query(`
        UPDATE subscription_plans
        SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
    `, [id]);
    return result.rows[0];
}

export { createPlan, updatePlan, getPlanById, getPlanByName, getActivePlans, deactivatePlan };
