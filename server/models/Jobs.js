import pool from "../config/db.js";

async function getAllJobs() {
    const result = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
    return result.rows;
}

async function getJobById(id) {
    const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
    return result.rows[0];
}

async function createJob(job) {
    const result = await pool.query(
        "INSERT INTO jobs (posted_by, title, company_name, location, work_mode, employment_type, description, salary_min, salary_max, currency, salary_period, easy_apply, post_at, applicant_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
        [job.posted_by, job.title, job.company_name, job.location, job.work_mode, job.employment_type, job.description, job.salary_min, job.salary_max, job.currency || 'INR', job.salary_period || 'year', job.easy_apply || false, job.post_at, job.applicant_limit || null]
    );
    return result.rows[0];
}   

async function deleteJob(id, postedBy) {
    const result = await pool.query("DELETE FROM jobs WHERE id = $1 AND posted_by = $2 RETURNING *", [id, postedBy]);
    return result.rows[0];
}
async function applyToJob(jobId, userId) {
    const result = await pool.query(
        "INSERT INTO applications (job_id, user_id) VALUES ($1, $2) RETURNING *",
        [jobId, userId]
    );
    return result.rows[0];
}

async function checkApplicationExists(jobId, userId) {
    const result = await pool.query(
        "SELECT * FROM applications WHERE job_id = $1 AND user_id = $2",
        [jobId, userId]
    );
    return result.rows.length > 0;
}

async function getApplicantCount(jobId) {
    const result = await pool.query("SELECT COUNT(*) FROM applications WHERE job_id = $1", [jobId]);
    return Number(result.rows[0].count);
}

async function getApplicantsForMyJobs(userId) {
    const query = `
        SELECT 
            a.id AS application_id,
            a.user_id,
            u.name,
            u.profile_picture_url,
            u.summary,
            a.job_id,
            j.title AS job_title,
            a.applied_at
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.user_id = u.id
        WHERE j.posted_by = $1
        ORDER BY a.applied_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

export { getAllJobs, getJobById, createJob, deleteJob, applyToJob, getApplicantCount, getApplicantsForMyJobs, checkApplicationExists };
