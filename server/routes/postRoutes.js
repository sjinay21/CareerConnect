import express from "express";
import { createPosts, getAllPosts, updatePosts, deletePosts } from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, uploadMiddleware.single("image"), createPosts);
router.get("/getPosts", authMiddleware, getAllPosts);
router.put("/update", authMiddleware, uploadMiddleware.single("image"), updatePosts);
router.delete("/delete", authMiddleware, deletePosts);
export default router;
