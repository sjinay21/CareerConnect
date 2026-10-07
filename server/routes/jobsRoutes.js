import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllJobs, getJobById, createJob, deleteJob, applyToJob, getApplicants } from "../controllers/jobsController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllJobs);
router.post("/", authMiddleware, createJob);
router.get("/:id", authMiddleware, getJobById);
router.delete("/:id", authMiddleware, deleteJob);
router.post("/:id/apply", authMiddleware, applyToJob);
router.get("/jobtracker/applicants", authMiddleware, getApplicants);
export default router;
