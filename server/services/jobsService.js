import { getAllJobs, getJobById, createJob, deleteJob } from "../models/Jobs.js";

export async function getallJobs() {
    return await getAllJobs();
}

export async function getJobbyid(id) {
    const job = await getJobById(id);
    if (!job) throw new Error("Job not found");
    return job;
}

export async function createjob(jobData, userId) {
    jobData.posted_by = userId;
    return await createJob(jobData);
}

export async function deletejob(id, userId) {
    const deletedJob = await deleteJob(id, userId);
    if (!deletedJob) throw new Error("Job not found or you are not authorized to delete it");
    return deletedJob;
}


