import { createOrGetConversation, getUserConversations, getConversationMembers } from "../services/conversationService.js";

export const createOrGetConversationController = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { userId: otherUserId } = req.body;

        if (!otherUserId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const conversation = await createOrGetConversation(currentUserId, otherUserId);
        res.status(200).json({
            message: "Conversation retrieved successfully",
            conversation
        });
    } catch (error) {
        console.error("Error creating/getting conversation:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const getUserConversationsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getUserConversations(userId, req.query.limit, req.query.offset);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching user conversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getConversationMembersController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const members = await getConversationMembers(conversationId);
        res.status(200).json({ members });
    } catch (error) {
        console.error("Error fetching conversation members:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
