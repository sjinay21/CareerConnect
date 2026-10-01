import express from "express";
import { getMe, updateMe, searchUsers, getAllUsers, getUserById } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/all",authMiddleware, getAllUsers);
router.get("/",authMiddleware, searchUsers); 
router.get("/profile", authMiddleware, getMe);
router.put("/update",authMiddleware,uploadMiddleware.fields([{ name: "profilePicture", maxCount: 1 },{ name: "banner", maxCount: 1 },]),updateMe);
router.get("/:id", authMiddleware, getUserById);

export default router;
