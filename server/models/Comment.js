import pool from "../config/db.js";

async function getComment(postId) {
    const query = `
        SELECT comments.*, users.name, users.summary 
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = $1
        ORDER BY comments.created_at ASC
    `;
    const result = await pool.query(query, [postId]);
    return result.rows;
}

async function addComment(postId, userId, parentCommentId, content) {
    const query = `
        INSERT INTO comments (post_id, user_id, parent_comment_id, content) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
    `;
    const result = await pool.query(query, [postId, userId, parentCommentId, content]);
    return result.rows[0];
}

async function getCommentById(commentId) {
    const query = `SELECT * FROM comments WHERE id = $1`;
    const result = await pool.query(query, [commentId]);
    return result.rows[0];
}

async function deleteComment(commentId) {
    const query = `DELETE FROM comments WHERE id = $1`;
    await pool.query(query, [commentId]);
}

async function updateComment(commentId, content) {
    const query = `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(query, [content, commentId]);
    return result.rows[0];
}

export { getComment, addComment, getCommentById, deleteComment, updateComment };
