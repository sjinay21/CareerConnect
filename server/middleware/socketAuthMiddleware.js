import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket, next) => {
    try {
        // Try getting token from auth object first, then try cookies
        let token = socket.handshake.auth?.token;
        if (!token && socket.handshake.headers.cookie) {
            const cookies = {};
            const cookieString = socket.handshake.headers.cookie;
            const cookieArray = cookieString.split(";");
            for (let i = 0; i < cookieArray.length; i++) {
                const cookie = cookieArray[i].trim();
                const parts = cookie.split("=");
                const name = parts[0];
                const value = parts[1];
                cookies[name] = value;
            }
            token = cookies.token;
        }
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
