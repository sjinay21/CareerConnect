import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});