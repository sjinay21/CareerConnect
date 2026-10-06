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
        "INSERT INTO jobs (posted_by, title, company_name, location, work_mode, employment_type, description, salary_min, salary_max, currency, salary_period, easy_apply) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        [job.posted_by, job.title, job.company_name, job.location, job.work_mode, job.employment_type, job.description, job.salary_min, job.salary_max, job.currency || 'INR', job.salary_period || 'year', job.easy_apply || false]
    );
    return result.rows[0];
}   

async function deleteJob(id, postedBy) {
    const result = await pool.query("DELETE FROM jobs WHERE id = $1 AND posted_by = $2 RETURNING *", [id, postedBy]);
    return result.rows[0];
}

export { getAllJobs, getJobById, createJob, deleteJob };
