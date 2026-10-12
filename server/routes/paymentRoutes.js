import express from "express";
import { createPaymentHandler } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPaymentHandler);

export default router;
