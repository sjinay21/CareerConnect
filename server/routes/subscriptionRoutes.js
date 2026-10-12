import express from "express";
import { createSubscriptionHandler, getMySubscriptionHandler, cancelMySubscriptionHandler,cancelSubscriptionByIdHandler } from "../controllers/subscriptionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSubscriptionHandler);
router.get("/me", authMiddleware, getMySubscriptionHandler);
router.post("/me/cancel", authMiddleware, cancelMySubscriptionHandler);
router.post("/:id/cancel", authMiddleware, cancelSubscriptionByIdHandler);

export default router;
