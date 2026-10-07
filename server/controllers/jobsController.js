import { getallJobs, getJobbyid, createjob, deletejob, processApplication, getTrackerApplicants } from "../services/jobsService.js";

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

async function applyToJob(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const application = await processApplication(id, userId);

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        if (error.message == 'Job not found') {
            return res.status(404).json({ message: "Job not found" });
        }
        if (error.message == 'Already applied') {
            return res.status(409).json({ message: "You have already applied to this job" });
        }
        if (error.message == 'You cannot apply to your own job') {
            return res.status(400).json({ message: "You cannot apply to your own job" });
        }
        if (error.message == 'Applicant limit reached') {
            return res.status(409).json({ message: "This job has reached its applicant limit" });
        }

        console.error("Error applying to job:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getApplicants(req, res) {
    try {
        const userId = req.user.id;
        const applicants = await getTrackerApplicants(userId);
        res.json({ applicants });
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export { getAllJobs, getJobById, createJob, deleteJob, applyToJob, getApplicants };