import { registerChatSocket } from "./chatSocket.js";

export const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`Socket connected:(User ID: ${socket.user?.id})`);
        
        // Register feature-specific socket handlers
        registerChatSocket(io, socket);
    });
};
