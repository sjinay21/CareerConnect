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

async function recordProfileView(viewerId, profileOwnerId) {
  const query = `
    INSERT INTO profile_views (viewer_id, profile_owner_id)
    SELECT $1, $2
    WHERE NOT EXISTS (
      SELECT 1 FROM profile_views
      WHERE viewer_id = $1
        AND profile_owner_id = $2
        AND viewed_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
    )
    RETURNING *;
  `;
  const result = await pool.query(query, [viewerId, profileOwnerId]);
  return result.rows[0] || null;
}

async function getProfileViewers(profileOwnerId) {
  const query = `
    SELECT pv.id AS view_id, pv.viewer_id, u.name, u.profile_picture_url, u.summary, pv.viewed_at
    FROM profile_views pv
    JOIN users u ON pv.viewer_id = u.id
    WHERE pv.profile_owner_id = $1
    ORDER BY pv.viewed_at DESC;
  `;
  const result = await pool.query(query, [profileOwnerId]);
  return result.rows;
}

export { getViewCount, recordProfileView, getProfileViewers };
