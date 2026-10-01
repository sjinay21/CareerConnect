import express from "express";
import { createMessageController, getMessageController } from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, createMessageController);
router.get("/:conversationId", authMiddleware, getMessageController);

export default router;
