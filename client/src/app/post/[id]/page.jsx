"use client";
import PrivateRoute from "@/Route/privateroute";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPosts, updatePost, deletePost } from "@/utils/api";
import Post from "@/components/feed/post";
import {
  TOAST_MESSAGES,
  showSuccessToast,
  showErrorToast,
} from "@/components/ui/toastUtils";

function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.id;
  // The first 8 characters are the random string. The rest is the actual post ID!
  const id = rawId.length > 8 ? rawId.substring(8) : rawId;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSinglePost() {
      try {
        const res = await getPosts();
        if (res.ok) {
          const data = await res.json();
          // Find the single post that matches the ID we extracted
          const foundPost = (data.posts || []).find((p) => p.id == id);
          setPost(foundPost);
        }
      } catch (e) {
        console.error("Error fetching post:", e);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchSinglePost();
    }
  }, [id]);

  async function handleUpdatePost(postId, content, formData) {
    if (!formData.has("postId")) formData.append("postId", postId);
    try {
      const response = await updatePost(postId, content, formData);
      const result = await response.json();
      if (!response.ok) {
        showErrorToast(result.message || TOAST_MESSAGES.POST_UPDATE_ERROR);
        return { success: false, message: result.message };
      }
      setPost({ ...post, ...result.post });
      showSuccessToast(TOAST_MESSAGES.POST_UPDATED);
      return { success: true };
    } catch (error) {
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
      return { success: false, message: "Network error occurred." };
    }
  }

  async function handleDeletePost(postId) {
    try {
      const res = await deletePost(postId);
      if (res.ok) {
        setPost(null);
        showSuccessToast("Post deleted successfully");
        // Optionally redirect back to feed after delete
        setTimeout(() => {
          router.push("/feeds");
        }, 1500);
      } else {
        const errorData = await res.json();
        showErrorToast(errorData.message || TOAST_MESSAGES.POST_DELETE_ERROR);
      }
    } catch (err) {
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
    }
  }

  return (
    <div className="w-full flex justify-center px-3 xl:px-5 py-8 bg-gray-100 min-h-screen">
      <div className="w-full md:w-[600px]">
        {loading ? (
          <div className="text-center text-gray-500 bg-white p-10 rounded-lg border border-gray-200 shadow-sm mt-5">
            Loading post...
          </div>
        ) : post ? (
          <Post
            post={post}
            onEdit={handleUpdatePost}
            onDelete={handleDeletePost}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white p-10 rounded-lg border border-gray-200 shadow-sm mt-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Post not found
            </h2>
            <p>This post may have been deleted or the link is invalid.</p>
            <button
              onClick={() => router.push("/feeds")}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Go to Feeds
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WrappedSinglePostPage() {
  return (
    <PrivateRoute>
      <SinglePostPage />
    </PrivateRoute>
  );
}
