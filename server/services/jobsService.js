import { getAllJobs, getJobById, createJob, deleteJob, applyToJob, getApplicantCount, getApplicantsForMyJobs, checkApplicationExists } from "../models/Jobs.js";

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

export async function processApplication(jobId, userId) {
    const job = await getJobById(jobId);
    if (!job) {
        throw new Error('Job not found');
    }

    if (job.posted_by == userId) {
        throw new Error('You cannot apply to your own job');
    }
    
    const hasApplied = await checkApplicationExists(jobId, userId);

    if (hasApplied) {
        throw new Error("Already applied");
    }

    if (job.applicant_limit !== null && job.applicant_limit !== undefined) {
        const currentCount = await getApplicantCount(jobId);
        if (currentCount >= job.applicant_limit) {
            throw new Error('Applicant limit reached');
        }
    }

    const result = await applyToJob(jobId, userId);
    if (!result) {
        throw new Error('Already applied');
    }
    
    return result;
}

export async function getTrackerApplicants(userId) {
    return await getApplicantsForMyJobs(userId);
}
