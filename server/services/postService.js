import { getallPosts, createPost as dbCreatePost, updatePost as dbUpdatePost, deletePost as dbDeletePost } from "../models/Post.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createPostService = async (content, file, user) => {
  if (!content && !file) {
    throw new Error("Post content or image is required");
  }

  let mediaUrl = null;
  if (file) {
    const cloudinaryResponse = await uploadOnCloudinary(file.path);
    if (!cloudinaryResponse) {
      throw new Error("Cloudinary upload failed");
    }
    mediaUrl = cloudinaryResponse.secure_url;
  }

  const postData = {
    authorId: user.id,
    content: content,
    mediaUrl: mediaUrl
  };

  const post = await dbCreatePost(postData);
  
  return {
    id: post.id,
    authorId: post.author_id,
    authorName: user.name,
    authorSummary: user.summary,
    authorProfilePicture: user.profile_picture_url,
    content: post.content,
    mediaUrl: post.media_url,
    createdAt: post.created_at
  };
};

export const getAllPostsService = async (userId) => {
  const rawPosts = await getallPosts(userId);
  return rawPosts.map((post) => ({
    id: post.id,
    authorId: post.author_id,
    authorName: post.name,
    authorSummary: post.summary,
    authorProfilePicture: post.profile_picture_url,
    content: post.content,
    mediaUrl: post.media_url,
    createdAt: post.created_at,
    likesCount: parseInt(post.likes_count, 10),
    commentsCount: parseInt(post.comments_count, 10),
    isLikedByUser: post.is_liked_by_user
  }));
};

export const updatePostService = async (postId, userId, content) => {
  if (!postId || !content) {
    throw new Error("Post ID and content are required");
  }

  const post = await dbUpdatePost(postId, userId, content, null);
  if (!post) {
    throw new Error("Post not found or unauthorized");
  }
  
  return {
    id: post.id,
    authorId: post.author_id,
    content: post.content,
    mediaUrl: post.media_url,
    createdAt: post.created_at
  };
};

export const deletePostService = async (postId, userId) => {
  if (!postId) {
    throw new Error("Post ID is required");
  }

  const post = await dbDeletePost(postId, userId);
  if (!post) {
    throw new Error("Post not found or unauthorized");
  }

  return {
    id: post.id,
    authorId: post.author_id,
    content: post.content,
    mediaUrl: post.media_url,
    createdAt: post.created_at
  };
};
