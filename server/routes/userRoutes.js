import express from "express";
import { getMe, updateMe, searchUsers } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", searchUsers); // Public user search endpoint
router.get("/profile", authMiddleware, getMe);
router.put("/update", authMiddleware, updateMe);

export default router;
