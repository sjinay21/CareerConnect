import { getallPosts, createPost, updatePost, deletePost } from "../models/Post.js";


import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createPosts = async (req, res) => {
  console.log("--> Received request at /posts/create");
  try {
    const { content } = req.body;

    // Require either text content OR an image
    if (!content && !req.file) {
      console.log("--> Validation failed: no content or file");
      return res.status(400).json({ message: "Post content or image is required" });
    }

    // Handle Image Upload
    let mediaUrl = null;
    if (req.file) {
      console.log("--> Multer succeeded! File exists at:", req.file.path);
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse) {
        return res.status(500).json({
          message: "Cloudinary upload failed"
        });
      }
      mediaUrl = cloudinaryResponse.secure_url;
    }

    const postData = {
      authorId: req.user.id,
      content: content,
      mediaUrl: mediaUrl
    };
    const post = await createPost(postData);
    res.status(201).json({
      message: "Post created successfully",
      post: {
        id: post.id,
        authorId: post.author_id,
        authorName: req.user.name,
        authorSummary: req.user.summary,
        content: post.content,
        mediaUrl: post.media_url,
        createdAt: post.created_at
      }
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const rawPosts = await getallPosts(req.user.id);
    const formattedPosts = rawPosts.map((post) => ({
      id: post.id,
      authorId: post.author_id,
      authorName: post.name,
      authorSummary: post.summary,
      content: post.content,
      mediaUrl: post.media_url,
      createdAt: post.created_at,
      likesCount: parseInt(post.likes_count, 10),
      isLikedByUser: post.is_liked_by_user
    }));

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePosts = async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) {
      return res.status(400).json({ message: "Post ID and content are required" });
    }

    const post = await updatePost(postId, req.user.id, content, null);
    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    res.status(200).json({
      message: "Post updated successfully",
      post: {
        id: post.id,
        authorId: post.author_id,
        content: post.content,
        mediaUrl: post.media_url,
        createdAt: post.created_at
      }
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePosts = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const post = await deletePost(postId, req.user.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    res.status(200).json({
      message: "Post deleted successfully",
      post: {
        id: post.id,
        authorId: post.author_id,
        content: post.content,
        mediaUrl: post.media_url,
        createdAt: post.created_at
      }
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};