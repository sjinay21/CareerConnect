import "dotenv/config";
import jwt from "jsonwebtoken";
import { findById } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    console.log("decode user:", user.id); 
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export default authMiddleware;