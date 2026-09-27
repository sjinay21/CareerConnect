import express from "express";
import { requestConnection, updateStatus, getConnections } from "../controllers/connectionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getConnections);
router.post("/request/:userId", authMiddleware, requestConnection);
router.put("/:connectionId/status", authMiddleware, updateStatus);

export default router;
