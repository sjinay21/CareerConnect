import { findConversation, createConversation, addMember, getConversationsByUserId, getConversationMembers as getConversationMembersModel } from "../models/Conversation.js";
import { PAGINATION_LIMITS } from "../config/paginationConfig.js";

export async function createOrGetConversation(currentUserId, otherUserId) {
    console.log(currentUserId, otherUserId);
    if (currentUserId == otherUserId) {
        const error = new Error("Cannot create a conversation with yourself");
        error.statusCode = 400;
        throw error;
    }

    const existingConversation = await findConversation(currentUserId, otherUserId);
    if (existingConversation) {
        return existingConversation;
    }

    const newConversation = await createConversation();
    await addMember(newConversation.id, currentUserId);
    await addMember(newConversation.id, otherUserId);

    return newConversation;
}

export async function getUserConversations(userId, limitParam, offsetParam) {
    const limit = Number(limitParam) || PAGINATION_LIMITS.CONVERSATIONS;
    const offset = Number(offsetParam) || 0;

    if (limit < 1 || offset < 0) {
        const error = new Error("Limit must be positive and offset cannot be negative");
        error.statusCode = 400;
        throw error;
    }

    const { conversations: rows, total: totalConversations } = await getConversationsByUserId(userId, limit, offset);
    
    const conversations = rows.map(row => ({
        conversationId: row.conversation_id,
        user: {
            id: row.user_id,
            name: row.name,
            summary: row.summary,
            location: row.location
        }
    }));

    const hasNextPage = offset + conversations.length < totalConversations;

    return {
        data: conversations,
        pagination: {
            limit,
            offset,
            totalConversations,
            hasNextPage
        }
    };
}

export async function getConversationMembers(conversationId) {
    return await getConversationMembersModel(conversationId);
}
