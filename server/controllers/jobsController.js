import { getallJobs, getJobbyid, createjob, deletejob } from "../services/jobsService.js";

async function getAllJobs(req, res) {
    try {
        const jobs = await getallJobs();
        res.json({ jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getJobById(req, res) {
    try {
        const { id } = req.params;
        const job = await getJobbyid(id);
        res.json({ job });
    } catch (error) {
        if (error.message === "Job not found") return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Server error" });
    }
}

async function createJob(req, res) {
    try {
        const jobData = req.body;
        // Securely grab the posted_by ID from the logged-in user token
        const userId = req.user.id; 
        
        const newJob = await createjob(jobData, userId);
        res.status(201).json({ job: newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteJob(req, res) {
    try {
        const { id } = req.params;
        // Securely grab the user ID from the token
        const userId = req.user.id;
        
        await deletejob(id, userId);
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        if (error.message === "Job not found or you are not authorized to delete it") {
            return res.status(403).json({ message: error.message });
        }
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export { getAllJobs, getJobById, createJob, deleteJob };