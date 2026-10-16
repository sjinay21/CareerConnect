import express from "express";
import {getActivePlans,getAllPlansAdmin,getPlanById,createPlan,updatePlan,deactivatePlan} from "../controllers/subscriptionPlanController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getActivePlans);
router.get("/all", authMiddleware, adminMiddleware, getAllPlansAdmin);
router.get("/:id", authMiddleware, getPlanById);
router.post("/", authMiddleware, adminMiddleware, createPlan);
router.put("/:id", authMiddleware, adminMiddleware, updatePlan);
router.delete("/:id", authMiddleware, adminMiddleware, deactivatePlan);

export default router;
