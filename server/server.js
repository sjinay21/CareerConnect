import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import subscriptionPlanRoutes from "./routes/subscriptionPlanRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { socketAuthMiddleware } from "./middleware/socketAuthMiddleware.js";
import { initializeSocket } from "./socket/socket.js";
import initializeCronJobs from "./utils/cronJobs.js";

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
app.use("/messages", messageRoutes);
app.use("/jobs", jobsRoutes);
app.use("/subscription-plans", subscriptionPlanRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/payments", paymentRoutes);

// Socket Authentication Middleware
io.use(socketAuthMiddleware);

// Initialize Socket.IO handlers
initializeSocket(io);

// Initialize cron jobs
initializeCronJobs();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});