import {
    getActivePlans,
    getAllPlans,
    getPlanById,
    getPlanByName,
    createPlan,
    updatePlan,
    deactivatePlan
} from "../models/SubscriptionPlan.js";

async function getAllActiveThePlans() {
    return await getActivePlans();
}

async function getAllPlansService() {
    return await getAllPlans();
}

async function getPlansById(id, isAdmin) {
    const plan = await getPlanById(id);
    if (!plan || (!plan.is_active && !isAdmin)) {
        throw { statusCode: 404, message: "Plan not found" };
    }
    return plan;
}

function validatePlansData(data) {
    if (data.name) {
        data.name = data.name.trim();
    }
    const { name, price, currency, billing_period, featureIds } = data;

    if (!name || isNaN(price) || price < 0 || !currency || !billing_period) {
        throw { statusCode: 400, message: "Invalid plan data provided" };
    }

    if (featureIds !== undefined) {
        if (!Array.isArray(featureIds)) {
            throw { statusCode: 400, message: "featureIds must be an array of feature IDs" };
        }
        for (const id of featureIds) {
            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                throw { statusCode: 400, message: "Invalid feature ID provided" };
            }
        }
    }
}

async function createPlans(data) {
    validatePlansData(data);
    if (!Array.isArray(data.featureIds)) {
        throw { statusCode: 400, message: "featureIds must be an array of feature IDs" };
    }
    return await createPlan(data, data.featureIds);
}

async function updatePlans(id, data) {
    validatePlansData(data);
    const plan = await getPlanById(id);
    if (!plan) {
        throw { statusCode: 404, message: "Plan not found" };
    }
    const existingPlan = await getPlanByName(data.name);
    if (existingPlan && Number(existingPlan.id) !== Number(id)) {
        throw { statusCode: 400, message: "A plan with this name already exists" };
    }
    return await updatePlan(id, data);
}

async function deletePlans(id) {
    const plan = await getPlanById(id);
    if (!plan) {
        throw { statusCode: 404, message: "Plan not found" };
    }
    return await deactivatePlan(id);
}

const deactivatePlans = deletePlans;

export {
    getAllActiveThePlans,
    getAllPlansService,
    getPlansById,
    createPlans,
    updatePlans,
    deletePlans,
    deactivatePlans
};
