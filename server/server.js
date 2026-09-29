import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import { socketAuthMiddleware } from "./middleware/socketAuthMiddleware.js";
import { getConversationMembers } from "./services/conversationService.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

// CORS configuration
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Built-in middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Public authentication routes
app.use("/", authRoutes);

// Protected user routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/like", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/experiences", experienceRoutes);
app.use("/connections", connectionRoutes);
app.use("/conversations", conversationRoutes);

// Socket Authentication Middleware
io.use(socketAuthMiddleware);

// Start server
io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (User ID: ${socket.user?.id})`);
    
    socket.on("join_conversation", async ({ conversationId }, callback) => {
        try {
            const userId = socket.user.id;
            
            // 1. Validate membership from database
            const members = await getConversationMembers(conversationId);
            const isMember = members.some(member => member.id === userId);

            if (!isMember) {
                console.log(`User ${userId} rejected from conversation_${conversationId} (Not a member)`);
                if (callback) callback({ success: false, message: "Not a conversation member" });
                return;
            }

            // 2. Join the Socket.IO room
            const roomName = `conversation_${conversationId}`;
            socket.join(roomName);
            
            console.log(`User ${userId} joined ${roomName}`);
            if (callback) callback({ success: true });
            
        } catch (error) {
            console.error("Error joining conversation room:", error);
            if (callback) callback({ success: false, message: "Server error" });
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id} (User ID: ${socket.user?.id})`);
    });

});
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});