import { getComment, addComment, getCommentById, updateComment, deleteComment } from "../models/Comment.js";

export const getComments = async (req, res) => {
    try {
        const { postId } = req.query; 
        
        if (!postId) {
            return res.status(400).json({ success: false, message: "Post ID is required" });
        }

        const comments = await getComment(postId);
        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Server error fetching comments" });
    }
};

export const addComments = async (req, res) => {
    try {
        const { postId, content, parentCommentId } = req.body;
        const userId = req.user.id;

        if (!postId || !content) {
            return res.status(400).json({ success: false, message: "Post ID and content are required" });
        }

        if (parentCommentId) {
            const parentComment = await getCommentById(parentCommentId);
            
            if (!parentComment) {
                return res.status(404).json({ success: false, message: "Parent comment not found" });
            }

            if (parentComment.post_id !== postId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Parent comment does not belong to this post. Invalid reply." 
                });
            }
        }

        const newComment = await addComment(postId, userId, parentCommentId || null, content);
        
        res.status(201).json({ 
            success: true, 
            message: "Comment added successfully",
            comment: newComment 
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, message: "Server error adding comment" });
    }
};

/*
export const updateComments = async (req, res) => {
    try {
        const { commentId, content } = req.body;
        const userId = req.user.id;

        if (!commentId || !content) {
            return res.status(400).json({ success: false, message: "Comment ID and content are required" });
        }

        // Verify ownership
        const existingComment = await getCommentById(commentId);
        if (!existingComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        if (existingComment.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this comment" });
        }

        const updatedComment = await updateComment(commentId, content);
        res.status(200).json({ success: true, message: "Comment updated", comment: updatedComment });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ success: false, message: "Server error updating comment" });
    }
};

export const deleteComments = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.user.id;

        if (!commentId) {
            return res.status(400).json({ success: false, message: "Comment ID is required" });
        }

        // Verify ownership
        const existingComment = await getCommentById(commentId);
        if (!existingComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        if (existingComment.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
        }

        await deleteComment(commentId);
        res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ success: false, message: "Server error deleting comment" });
    }
};
*/
