import express from "express";
import { createOrGetConversationController, getUserConversationsController, getConversationMembersController } from "../controllers/conversationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrGetConversationController);
router.get("/Userlist", authMiddleware, getUserConversationsController);
router.get("/:conversationId/members", authMiddleware, getConversationMembersController);

export default router;

