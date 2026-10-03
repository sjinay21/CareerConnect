import pool from "../config/db.js";

async function createMessage(conversationId, senderId, content) {
    const query = `
        INSERT INTO messages (conversation_id, sender_id, content, created_at, is_seen) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) 
        RETURNING *
    `;
    const result = await pool.query(query,[conversationId, senderId,content,false]);
    return result.rows[0];
}
async function getMessagesByConversation(conversationId, limit, offset) {
    const query = `
        SELECT * FROM messages 
        WHERE conversation_id = $1 
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
    `;
    const countQuery = `
        SELECT COUNT(*) FROM messages
        WHERE conversation_id = $1
    `;
    const [result, countResult] = await Promise.all([
        pool.query(query, [conversationId, limit, offset]),
        pool.query(countQuery, [conversationId])
    ]);
    return {
        messages: result.rows,
        total: parseInt(countResult.rows[0].count, 10)
    };
}
async function markMessagesAsSeen(conversationId, userId) {
    const query = `
        UPDATE messages
        SET is_seen = true
        WHERE conversation_id = $1
        AND sender_id != $2
        AND is_seen = false
    `;

    await pool.query(query, [conversationId, userId]);
}
export { createMessage, getMessagesByConversation, markMessagesAsSeen };