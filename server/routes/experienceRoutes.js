import express from "express";
import { getExperiences, createExperience, editExperience, removeExperience } from "../controllers/experienceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getexperiences", authMiddleware, getExperiences);
router.post("/addexperience", authMiddleware, createExperience);
router.put("/updateexperience/:id", authMiddleware, editExperience);
router.delete("/deleteexperience/:id", authMiddleware, removeExperience);

export default router;
