import pool from "../config/db.js";

async function insertCronJobLog(jobName, successCount, rejectCount) {
  const result = await pool.query(
    `INSERT INTO cron_job_logs (job_name, success_count, reject_count)
     VALUES ($1, $2, $3) RETURNING *`,
    [jobName, successCount, rejectCount]
  );
  return result.rows[0];
}

export { insertCronJobLog };
