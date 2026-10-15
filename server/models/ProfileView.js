import pool from "../config/db.js";

async function getViewCount(profileOwnerId) {
  const query = `
    SELECT 
      COUNT(*) FILTER (WHERE viewed_at >= NOW() - INTERVAL '7 days') AS last_7_days,
      COUNT(*) FILTER (WHERE viewed_at >= NOW() - INTERVAL '30 days') AS last_30_days,
      COUNT(*) FILTER (WHERE viewed_at >= NOW() - INTERVAL '90 days') AS last_90_days
    FROM profile_views 
    WHERE profile_owner_id = $1;
  `;
  const result = await pool.query(query, [profileOwnerId]);
  const row = result.rows[0] || {};
  return {
    last7Days: parseInt(row.last_7_days, 10) || 0,
    last30Days: parseInt(row.last_30_days, 10) || 0,
    last90Days: parseInt(row.last_90_days, 10) || 0,
  };
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

async function getProfileViewers(profileOwnerId, period = 30) {
  const query = `
    SELECT pv.id AS view_id, pv.viewer_id, u.name, u.profile_picture_url, u.summary, pv.viewed_at
    FROM profile_views pv
    JOIN users u ON pv.viewer_id = u.id
    WHERE pv.profile_owner_id = $1
      AND pv.viewed_at >= NOW() - make_interval(days => $2)
    ORDER BY pv.viewed_at DESC;
  `;
  const result = await pool.query(query, [profileOwnerId, period]);
  return result.rows;
}

async function getProfileViewsGraph(profileOwnerId, period = 30) {
  const query = `
    SELECT
      DATE(viewed_at) AS view_date,
      COUNT(*) AS total_views
    FROM profile_views
    WHERE profile_owner_id = $1
      AND viewed_at >= NOW() - INTERVAL '1 day' * $2
    GROUP BY DATE(viewed_at)
    ORDER BY view_date ASC;
  `;

  const result = await pool.query(query, [profileOwnerId, period]);
  return result.rows;
}

export { getViewCount, recordProfileView, getProfileViewers, getProfileViewsGraph };
