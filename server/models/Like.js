import pool from "../config/db.js";

async function islikedPost(postId, userId) {
    // Check if the like already exists
    const checkQuery = `SELECT id FROM likes WHERE post_id = $1 AND user_id = $2`;
    const checkResult = await pool.query(checkQuery, [postId, userId]);

    let isLiked = false;
    if (checkResult.rows.length > 0) {
        // Like exists, so delete it (Unlike)
        const deleteQuery = `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`;
        await pool.query(deleteQuery, [postId, userId]);
        isLiked = false;
    } else {
        // Like doesn't exist, so insert it (Like)
        const insertQuery = `INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`;
        await pool.query(insertQuery, [postId, userId]);
        isLiked = true;
    }

    // Get updated total count
    const countQuery = `SELECT COUNT(*) FROM likes WHERE post_id = $1`;
    const countResult = await pool.query(countQuery, [postId]);
    const likesCount = parseInt(countResult.rows[0].count, 10);

    return { liked: isLiked, likesCount: likesCount };
}

async function getLikesForPost(postId) {
    const query = `
        SELECT u.id, u.name, u.summary, u.profile_picture_url
        FROM likes l
        JOIN users u ON l.user_id = u.id
        WHERE l.post_id = $1
        ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query, [postId]);
    return result.rows;
}

export { islikedPost, getLikesForPost };
