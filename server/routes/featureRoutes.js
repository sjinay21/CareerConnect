import express from "express";
import {
  getAllFeaturesHandler,
  getFeatureByIdHandler,
  createFeatureHandler,
  updateFeatureHandler,
  deleteFeatureHandler,
} from "../controllers/featureController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Read operations: authenticated users/admins
router.get("/", authMiddleware, getAllFeaturesHandler);
router.get("/:id", authMiddleware, getFeatureByIdHandler);

// Admin-only operations: create, update, delete
router.post("/", authMiddleware, adminMiddleware, createFeatureHandler);
router.put("/:id", authMiddleware, adminMiddleware, updateFeatureHandler);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFeatureHandler);

export default router;
