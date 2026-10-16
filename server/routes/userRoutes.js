import express from "express";
import { getMe, updateMe, searchTheUsers, getAllUsers, getUserById, getProfileViewers, getProfileViewsGraph } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { requirePeriodFilter,requireProfileViewsGraph} from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, getAllUsers);
router.get("/", authMiddleware, searchTheUsers); 
router.get("/profile", authMiddleware, getMe);
router.get("/profile/viewers", authMiddleware, requirePeriodFilter, getProfileViewers);
router.get("/profile/views/graph", authMiddleware, requireProfileViewsGraph, getProfileViewsGraph);
router.put("/update",authMiddleware,uploadMiddleware.fields([{ name: "profilePicture", maxCount: 1 },{ name: "banner", maxCount: 1 },]),updateMe);
router.get("/:id", authMiddleware, getUserById);

export default router;
