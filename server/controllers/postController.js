import { createPostService, getAllPostsService, updatePostService, deletePostService } from "../services/postService.js";

export const createPosts = async (req, res) => {
  console.log("--> Received request at /posts/create");
  try {
    const { content } = req.body;
    const postResponse = await createPostService(content, req.file, req.user);

    res.status(201).json({
      message: "Post created successfully",
      post: postResponse
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    if (error.message == "Post content or image is required") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message == "Cloudinary upload failed") {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const formattedPosts = await getAllPostsService(req.user.id);
    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePosts = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const postResponse = await updatePostService(postId, req.user.id, content);

    res.status(200).json({
      message: "Post updated successfully",
      post: postResponse
    });
  } catch (error) {
    console.error("Error updating post:", error.message);
    if (error.message == "Post ID and content are required") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message == "Post not found or unauthorized") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePosts = async (req, res) => {
  try {
    const { postId } = req.body;
    const postResponse = await deletePostService(postId, req.user.id);

      res.status(200).json({
        message: "Post deleted successfully",
        post: postResponse
      });
    } catch (error) {
      console.error("Error deleting post:", error.message);
      if (error.message == "Post ID is required") {
        return res.status(400).json({ message: error.message });
      }
      if (error.message == "Post not found or unauthorized") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };