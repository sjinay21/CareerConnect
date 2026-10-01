import { getConversationMembers } from "../services/conversationService.js";
import { sendMessage } from "../services/messageService.js";
import { markMessagesAsSeen } from "../models/Messages.js";
export const registerChatSocket = (io, socket) => {
    socket.on("join_conversation", async ({ conversationId }, callback) => {
        try {
            const userId = socket.user.id;
            // 1. Validate membership from database
            const members = await getConversationMembers(conversationId);
            const isMember = members.some(member => member.id == userId);
            if (!isMember) {
                console.log(`User ${userId} rejected from conversation_${conversationId} (Not a member)`);
                if (callback) callback({ success: false, message: "Not a conversation member" });
                return;
            }
            // 2. Join the Socket.IO room
            const roomName = `conversation_${conversationId}`;
            socket.join(roomName);
            await markMessagesAsSeen(conversationId, userId);
            
            // Tell the other user in the room that we've seen their messages
            socket.to(roomName).emit("messages_seen", { conversationId, byUserId: userId });

            console.log(`User ${userId} joined ${roomName}`);
            if (callback) {
                callback({ success: true });
            }
        } catch (error) {
            console.error("Error joining conversation room:", error);
            if (callback) {
                const errorMessage = error.message == "Message content cannot be empty" || error.message == "Sender is not a member of this conversation" ? error.message : "Unable to send message";
                callback({ success: false, message: errorMessage });
            }
        }
    });

    socket.on("send_message", async (data, callback) => {
        try {
            const { conversationId, content } = data;
            const userId = socket.user.id;
            // 1. Validate and save the message
            const message = await sendMessage(conversationId, userId, content);
            // 2. Emit to the conversation room
            const roomName = `conversation_${conversationId}`;
            io.to(roomName).emit("new_message", message);
            // 3. Acknowledge success
            if (callback) {
                callback({ success: true, message });
            }
        } catch (error) {
            console.error("Error sending message:", error.message);
            if (callback) {
                const errorMessage = error.message == "Message content cannot be empty" || error.message == "Sender is not a member of this conversation" ? error.message : "Unable to send message";
                callback({ success: false, message: errorMessage });
            }
        }
    });

    socket.on("mark_as_seen", async ({ conversationId }) => {
        const userId = socket.user.id;
        await markMessagesAsSeen(conversationId, userId);
        
        const roomName = `conversation_${conversationId}`;
        socket.to(roomName).emit("messages_seen", { conversationId, byUserId: userId });
    });
    socket.on("typing", ({ conversationId }) => {
        const roomName = `conversation_${conversationId}`;
        socket.to(roomName).emit("typing", { conversationId });
    });

    socket.on("stop_typing", ({ conversationId }) => {
        const roomName = `conversation_${conversationId}`;
        socket.to(roomName).emit("stop_typing", { conversationId });
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id} (User ID: ${socket.user?.id})`);
    });
};
