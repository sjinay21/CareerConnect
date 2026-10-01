import { sendMessage, getMessages } from "../services/messageService.js";

export const createMessageController = async (req, res) => {
    try {
        const { content, conversationId } = req.body;
        const message = await sendMessage(conversationId, req.user.id, content);
        res.status(201).json(message);
    } catch (error) {
        console.error("Error creating message:", error.message);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export const getMessageController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await getMessages(conversationId, req.user.id);
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}