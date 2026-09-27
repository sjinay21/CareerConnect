import express from "express";
import { getMe, updateMe, searchUsers, getAllUsers } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all",authMiddleware, getAllUsers);
router.get("/",authMiddleware, searchUsers); 
router.get("/profile", authMiddleware, getMe);
router.put("/update", authMiddleware, updateMe);

export default router;
