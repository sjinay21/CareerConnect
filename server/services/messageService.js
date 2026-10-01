import { createMessage, getMessagesByConversation } from "../models/Messages.js";
import { getConversationMembers } from "./conversationService.js";

export const sendMessage = async (conversationId, senderId, content) => {
    // 1. Check that the message content is not empty
    if (!content || content.trim() == "") {
        throw new Error("Message content cannot be empty");
    }


    // 2. Check that the sender is a member of the conversation
    const members = await getConversationMembers(conversationId);
    const isMember = members.some(member => member.id == senderId);

    if (!isMember) {
        throw new Error("Sender is not a member of this conversation");
    }

    // 3. Save the message using createMessage
    // 4. Return the saved message
    return await createMessage(conversationId, senderId, content);
};

export const getMessages = async (conversationId, userId) => {
    // 1. Check that the user belongs to the conversation
    const members = await getConversationMembers(conversationId);
    const isMember = members.some(member => member.id == userId);

    if (!isMember) {
        throw new Error("User is not a member of this conversation");
    }

    // 2. Fetch messages using getMessagesByConversation
    // 3. Return the messages
    return await getMessagesByConversation(conversationId);
};