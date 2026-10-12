import pool from "../config/db.js";

async function getViewCount(profileOwnerId) {
  const query = `
    SELECT COUNT(*) 
    FROM profile_views 
    WHERE profile_owner_id = $1;
  `;
  const result = await pool.query(query, [profileOwnerId]);
  return parseInt(result.rows[0].count, 10);
}

export { getViewCount };
