import pool from "../config/db.js";

async function getExperiencesByUserId(userId) {
    const query = `
        SELECT * FROM experiences 
        WHERE user_id = $1 
        ORDER BY start_date DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

async function addExperience(userId, jobTitle, companyName, location, startDate, endDate, isCurrent, description) {
    const query = `
        INSERT INTO experiences (user_id, job_title, company_name, location, start_date, end_date, is_current, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
    `;
    const result = await pool.query(query, [userId, jobTitle, companyName, location, startDate, endDate, isCurrent, description]);
    return result.rows[0];
}

async function updateExperience(id, jobTitle, companyName, location, startDate, endDate, isCurrent, description) {
    const query = `
        UPDATE experiences 
        SET job_title = $1, company_name = $2, location = $3, start_date = $4, end_date = $5, is_current = $6, description = $7
        WHERE id = $8 
        RETURNING *
    `;
    const result = await pool.query(query, [jobTitle, companyName, location, startDate, endDate, isCurrent, description, id]);
    return result.rows[0];
}

async function deleteExperience(id) {
    const query = `DELETE FROM experiences WHERE id = $1`;
    await pool.query(query, [id]);
}

export { getExperiencesByUserId, addExperience, updateExperience, deleteExperience };
