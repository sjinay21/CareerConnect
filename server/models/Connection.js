import pool from "../config/db.js";

async function findConnectionBetween(userId1, userId2) {
  const result = await pool.query(
    `SELECT * FROM connections 
     WHERE (requester_id = $1 AND receiver_id = $2) 
        OR (requester_id = $2 AND receiver_id = $1)`,
    [userId1, userId2]
  );
  return result.rows[0];
}

async function createRequest(requesterId, receiverId) {
  const result = await pool.query(
    "INSERT INTO connections (requester_id, receiver_id, status) VALUES ($1, $2, 'pending') RETURNING *",
    [requesterId, receiverId]
  );
  return result.rows[0];
}

async function updateStatus(connectionId, status, cooldownUntil = null) {
  const result = await pool.query(
    "UPDATE connections SET status = $1, cooldown_until = $2 WHERE id = $3 RETURNING *",
    [status, cooldownUntil, connectionId]
  );
  return result.rows[0];
}

async function getUserConnections(userId) {
  const receivedQuery = `
    SELECT c.id AS connection_id, c.status, c.created_at, c.cooldown_until, u.id, u.name, u.summary, u.location, u.profile_picture_url
    FROM connections c
    JOIN users u ON c.requester_id = u.id
    WHERE c.receiver_id = $1 AND c.status = 'pending'
  `;

  const sentQuery = `
    SELECT c.id AS connection_id, c.status, c.created_at, c.cooldown_until, u.id, u.name, u.summary, u.location, u.profile_picture_url
    FROM connections c
    JOIN users u ON c.receiver_id = u.id
    WHERE c.requester_id = $1 AND c.status IN ('pending', 'expired', 'rejected')
  `;

  const friendsQuery = `
    SELECT c.id AS connection_id, c.status, c.created_at, c.cooldown_until, u.id, u.name, u.summary, u.location, u.profile_picture_url
    FROM connections c
    JOIN users u ON u.id = CASE 
      WHEN c.requester_id = $1 THEN c.receiver_id 
      ELSE c.requester_id 
    END
    WHERE (c.requester_id = $1 OR c.receiver_id = $1) AND c.status = 'accepted'
  `;

  const [receivedResult, sentResult, friendsResult] = await Promise.all([
    pool.query(receivedQuery, [userId]),
    pool.query(sentQuery, [userId]),
    pool.query(friendsQuery, [userId])
  ]);

  const mapToUserFormat = (rows) => rows.map(row => ({
    connectionId: row.connection_id,
    status: row.status,
    created_at: row.created_at,
    cooldown_until: row.cooldown_until,
    user: {
      id: row.id,
      name: row.name,
      summary: row.summary,
      location: row.location,
      profilePicture: row.profile_picture_url
    }
  }));

  return {
    received: mapToUserFormat(receivedResult.rows),
    sent: mapToUserFormat(sentResult.rows),
    friends: mapToUserFormat(friendsResult.rows)
  };
}

async function recreateRequest(connectionId, requesterId, receiverId) {
  await pool.query(
    "UPDATE connections SET requester_id = $2, receiver_id = $3, status = 'pending', created_at = CURRENT_TIMESTAMP, cooldown_until = NULL WHERE id = $1",
    [connectionId, requesterId, receiverId]
  );
  
  return { id: connectionId, requester_id: requesterId, receiver_id: receiverId, status: 'pending' };
}

async function expireOldRequests(expiryDate, cooldownUntil) {
  const result = await pool.query(
    `UPDATE connections SET status = 'expired', cooldown_until = $2 WHERE status = 'pending' AND created_at < $1`,
    [expiryDate, cooldownUntil]
  );

  return result.rowCount;
}
export { findConnectionBetween, createRequest, updateStatus, getUserConnections, expireOldRequests, recreateRequest };
