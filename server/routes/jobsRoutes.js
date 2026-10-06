import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllJobs, getJobById, createJob, deleteJob } from "../controllers/jobsController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllJobs);
router.get("/:id", authMiddleware, getJobById);
router.post("/", authMiddleware, createJob);
router.delete("/:id", authMiddleware, deleteJob);

export default router;
