import { findConversation, createConversation, addMember, getConversationsByUserId, getConversationMembers as getConversationMembersModel } from "../models/Conversation.js";

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

export async function getUserConversations(userId) {
    const rows = await getConversationsByUserId(userId);
    return rows.map(row => ({
        conversationId: row.conversation_id,
        user: {
            id: row.user_id,
            name: row.name,
            summary: row.summary,
            location: row.location
        }
    }));
}

export async function getConversationMembers(conversationId) {
    return await getConversationMembersModel(conversationId);
}
