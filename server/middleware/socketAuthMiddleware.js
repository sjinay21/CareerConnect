import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("Socket JWT error:", error.message);
        next(new Error("Authentication error: Invalid token"));
    }
};
