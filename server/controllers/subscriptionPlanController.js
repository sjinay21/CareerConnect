import {getAllActiveThePlans,getPlansById,createPlans,updatePlans,deactivatePlans} from "../services/subscriptionPlanService.js";

async function getActivePlans(req, res) {
    try {
        const plans = await getAllActiveThePlans();
        res.status(200).json(plans);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

async function getPlanById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid plan ID" });
        }
        const isAdmin = req.user && req.user.role === 'admin';
        const plan = await getPlansById(id, isAdmin);
        res.status(200).json(plan);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

async function createPlan(req, res) {
    try {
        const plan = await createPlans(req.body);
        res.status(201).json(plan);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

async function updatePlan(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid plan ID" });
        }
        const plan = await updatePlans(id, req.body);
        res.status(200).json(plan);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

async function deactivatePlan(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid plan ID" });
        }
        const plan = await deactivatePlans(id);
        res.status(200).json(plan);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

export {
    getActivePlans,
    getPlanById,
    createPlan,
    updatePlan,
    deactivatePlan
};
