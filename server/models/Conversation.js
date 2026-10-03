import pool from "../config/db.js";

async function findConversation(user1Id, user2Id) {
    const query = `
        SELECT conversations.*
        FROM conversations
        JOIN conversation_members cm1 ON conversations.id = cm1.conversation_id
        JOIN conversation_members cm2 ON conversations.id = cm2.conversation_id
        WHERE cm1.user_id = $1 AND cm2.user_id = $2
        AND (SELECT COUNT(*) FROM conversation_members WHERE conversation_id = conversations.id) = 2
    `;
    const result = await pool.query(query, [user1Id, user2Id]);
    return result.rows[0];
}

async function createConversation() {
    const result = await pool.query(
        "INSERT INTO conversations DEFAULT VALUES RETURNING *"
    );
    return result.rows[0];
}

async function addMember(conversationId, userId) {
    const result = await pool.query(
        "INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2) RETURNING *"
    , [conversationId, userId]);
    return result.rows[0];
}

async function getConversationsByUserId(userId, limit, offset) {
    const query = `
        SELECT cm1.conversation_id, c.created_at, u.id as user_id, u.name, u.summary, u.location, u.profile_picture_url
        FROM conversations c
        JOIN conversation_members cm1 ON c.id = cm1.conversation_id AND cm1.user_id = $1
        JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id != $1
        JOIN users u ON u.id = cm2.user_id
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
    `;
    const countQuery = `
        SELECT COUNT(*)
        FROM conversations c
        JOIN conversation_members cm1 ON c.id = cm1.conversation_id AND cm1.user_id = $1
    `;
    const [result, countResult] = await Promise.all([
        pool.query(query, [userId, limit, offset]),
        pool.query(countQuery, [userId])
    ]);
    return {
        conversations: result.rows,
        total: parseInt(countResult.rows[0].count, 10)
    };
}

async function getConversationMembers(conversationId) {
    const query = `
        SELECT u.id, u.name, u.summary, u.location, u.profile_picture_url
        FROM users u
        JOIN conversation_members cm ON cm.user_id = u.id
        WHERE cm.conversation_id = $1
    `;
    const result = await pool.query(query, [conversationId]);
    return result.rows;
}

export {
    findConversation,
    createConversation,
    addMember,
    getConversationsByUserId,
    getConversationMembers
};
