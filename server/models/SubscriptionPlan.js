import pool from "../config/db.js";

async function getFeaturesByPlanId(planId, client = pool) {
    const query = `
        SELECT f.id, f.name, f.description, f.is_active
        FROM features f
        JOIN plan_features pf ON f.id = pf.feature_id
        WHERE pf.plan_id = $1
        ORDER BY f.id ASC;
    `;
    const result = await client.query(query, [planId]);
    return result.rows;
}

async function getActivePlans() {
    const result = await pool.query(
        "SELECT * FROM subscription_plans WHERE is_active = TRUE ORDER BY id ASC;"
    );
    const plans = result.rows;

    for (const plan of plans) {
        plan.features = await getFeaturesByPlanId(plan.id);
    }

    return plans;
}

async function getAllPlans() {
    const result = await pool.query(
        "SELECT * FROM subscription_plans ORDER BY id ASC;"
    );
    return result.rows;
}

async function getPlanById(id) {
    const result = await pool.query("SELECT * FROM subscription_plans WHERE id = $1;", [id]);
    const plan = result.rows[0];
    if (!plan) return null;

    plan.features = await getFeaturesByPlanId(id);
    return plan;
}

async function getPlanByName(name) {
    const result = await pool.query("SELECT * FROM subscription_plans WHERE name = $1;", [name]);
    const plan = result.rows[0];
    if (!plan) return null;

    plan.features = await getFeaturesByPlanId(plan.id);
    return plan;
}

async function createPlan(planData, featureIds = []) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const uniqueFeatureIds = [...new Set(featureIds.map(Number))];

        // 1. Ensure selected features exist and are active (single query)
        if (uniqueFeatureIds.length > 0) {
            const placeholders = uniqueFeatureIds.map((_, index) => `$${index + 1}`).join(", ");
            const featureCheck = await client.query(
                `SELECT id FROM features WHERE id IN (${placeholders}) AND is_active = TRUE;`,
                uniqueFeatureIds
            );
            if (featureCheck.rows.length !== uniqueFeatureIds.length) {
                throw { statusCode: 400, message: "One or more selected features do not exist or are inactive" };
            }
        }

        // 2. Insert new plan
        const planQuery = `
            INSERT INTO subscription_plans (name, description, price, currency, billing_period)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const planResult = await client.query(planQuery, [
            planData.name,
            planData.description || null,
            planData.price,
            planData.currency || "INR",
            planData.billing_period || "monthly",
        ]);
        const plan = planResult.rows[0];

        // 3. Insert into plan_features (single query)
        if (uniqueFeatureIds.length > 0) {
            const values = uniqueFeatureIds.map((_, index) => `($1, $${index + 2})`).join(", ");
            await client.query(
                `INSERT INTO plan_features (plan_id, feature_id) VALUES ${values};`,
                [plan.id, ...uniqueFeatureIds]
            );
        }

        // 4. Fetch assigned features before committing using the transaction client
        plan.features = await getFeaturesByPlanId(plan.id, client);

        // 5. Commit transaction
        await client.query("COMMIT");

        return plan;
    } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505") {
            throw { statusCode: 400, message: "A plan with this name already exists" };
        }
        throw error;
    } finally {
        client.release();
    }
}

async function updatePlan(id, { name, description, price, currency, billing_period, featureIds }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const hasFeatureIds = Array.isArray(featureIds);
        const uniqueFeatureIds = hasFeatureIds ? [...new Set(featureIds.map(Number))] : [];

        // 1. Ensure selected features exist and are active
        if (hasFeatureIds && uniqueFeatureIds.length > 0) {
            const placeholders = uniqueFeatureIds.map((_, index) => `$${index + 1}`).join(", ");
            const featureCheck = await client.query(
                `SELECT id FROM features WHERE id IN (${placeholders}) AND is_active = TRUE;`,
                uniqueFeatureIds
            );
            if (featureCheck.rows.length !== uniqueFeatureIds.length) {
                throw { statusCode: 400, message: "One or more selected features do not exist or are inactive" };
            }
        }

        // 2. Update subscription_plans row
        const updateQuery = `
            UPDATE subscription_plans
            SET name = $1, description = $2, price = $3, currency = $4, billing_period = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *;
        `;
        const result = await client.query(updateQuery, [
            name,
            description !== undefined ? description : null,
            price,
            currency || "INR",
            billing_period || "monthly",
            id
        ]);
        const plan = result.rows[0];
        if (!plan) {
            await client.query("ROLLBACK");
            return null;
        }

        // 3. Update plan_features mapping if featureIds was provided
        if (hasFeatureIds) {
            await client.query("DELETE FROM plan_features WHERE plan_id = $1;", [id]);
            if (uniqueFeatureIds.length > 0) {
                const values = uniqueFeatureIds.map((_, index) => `($1, $${index + 2})`).join(", ");
                await client.query(
                    `INSERT INTO plan_features (plan_id, feature_id) VALUES ${values};`,
                    [id, ...uniqueFeatureIds]
                );
            }
        }

        // 4. Fetch assigned features using client
        plan.features = await getFeaturesByPlanId(id, client);

        await client.query("COMMIT");
        return plan;
    } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505") {
            throw { statusCode: 400, message: "A plan with this name already exists" };
        }
        throw error;
    } finally {
        client.release();
    }
}

async function deletePlan(id) {
    const plan = await getPlanById(id);
    if (!plan) return null;

    // Check if plan is referenced by user subscriptions
    const subCheck = await pool.query(
        "SELECT COUNT(*) FROM subscriptions WHERE plan_id = $1;",
        [id]
    );
    const subCount = parseInt(subCheck.rows[0].count, 10);
    if (subCount > 0) {
        const error = new Error(`Cannot delete plan "${plan.name}" because it is currently assigned to ${subCount} user subscription(s).`);
        error.statusCode = 400;
        error.code = "PLAN_IN_USE";
        throw error;
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM plan_features WHERE plan_id = $1;", [id]);
        const result = await client.query(
            "DELETE FROM subscription_plans WHERE id = $1 RETURNING *;",
            [id]
        );
        await client.query("COMMIT");
        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23503") {
            const fkError = new Error(`Cannot delete plan "${plan.name}" because it is referenced by existing database records.`);
            fkError.statusCode = 400;
            throw fkError;
        }
        throw error;
    } finally {
        client.release();
    }
}

const deactivatePlan = deletePlan;

export {
    createPlan,
    updatePlan,
    getPlanById,
    getPlanByName,
    getActivePlans,
    getAllPlans,
    deletePlan,
    deactivatePlan,
    getFeaturesByPlanId,
};
