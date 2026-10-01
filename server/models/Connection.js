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

async function updateStatus(connectionId, status) {
  const result = await pool.query(
    "UPDATE connections SET status = $1 WHERE id = $2 RETURNING *",
    [status, connectionId]
  );
  return result.rows[0];
}

async function getUserConnections(userId) {
  const receivedQuery = `
    SELECT c.id AS connection_id, u.id, u.name, u.summary, u.location, u.profile_picture_url
    FROM connections c
    JOIN users u ON c.requester_id = u.id
    WHERE c.receiver_id = $1 AND c.status = 'pending'
  `;

  const sentQuery = `
    SELECT c.id AS connection_id, u.id, u.name, u.summary, u.location, u.profile_picture_url
    FROM connections c
    JOIN users u ON c.receiver_id = u.id
    WHERE c.requester_id = $1 AND c.status = 'pending'
  `;

  const friendsQuery = `
    SELECT c.id AS connection_id, u.id, u.name, u.summary, u.location, u.profile_picture_url
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

export { findConnectionBetween, createRequest, updateStatus, getUserConnections };
