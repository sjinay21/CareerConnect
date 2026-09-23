import { islikedPost } from "../models/Like.js";

export const islikePostLikeController = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id; 

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const result = await islikedPost(postId, userId);
        
        res.status(200).json({
            message: "Success",
            liked: result.liked,
            likesCount: result.likesCount
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
