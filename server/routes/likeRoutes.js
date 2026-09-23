import express from "express";
import { islikePostLikeController } from "../controllers/likeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/islike", authMiddleware, islikePostLikeController);

export default router;
