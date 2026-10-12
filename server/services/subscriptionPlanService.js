import { getActivePlans, getPlanById, getPlanByName, createPlan, updatePlan, deactivatePlan } from "../models/SubscriptionPlan.js";

async function getAllActiveThePlans() {
    return await getActivePlans();
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
    const { name, price, currency, billing_period } = data;
    if (!name || isNaN(price) || price < 0 || !currency || !billing_period) {
        throw { statusCode: 400, message: "Invalid plan data provided" };
    }
}

async function createPlans(data) {
    validatePlansData(data);
    const plan = await createPlan(data);
    if (!plan) {
        throw { statusCode: 400, message: "A plan with this name already exists" };
    }
    return plan;
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

async function deactivatePlans(id) {
    const plan = await getPlanById(id);
    if (!plan) {
        throw { statusCode: 404, message: "Plan not found" };
    }
    return await deactivatePlan(id);
}

export { getAllActiveThePlans, getPlansById, createPlans, updatePlans, deactivatePlans };
