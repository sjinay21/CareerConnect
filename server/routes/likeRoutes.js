import express from "express";
import { islikePostLikeController, getPostLikesController } from "../controllers/likeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/islike", authMiddleware, islikePostLikeController);
router.get("/:postId/likes", authMiddleware, getPostLikesController);

export default router;
