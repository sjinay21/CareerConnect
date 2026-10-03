"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState, useEffect } from "react";
import Card from "@/components/shared/card";
import Post from "@/components/feed/post";
import Profile from "@/components/profile/profile";
import Advertisement from "@/components/feed/advertisement";
import Model from "@/components/shared/model";
import AddModel from "@/components/feed/addmodel";
import { useAppNavigation } from "@/hooks/useNavigation";
import ArticleCard from "@/components/feed/articlecard";
import { getPosts, createPost, updatePost, deletePost } from "@/utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast, showDeleteToast } from "@/components/ui/toastUtils";
import { useProfile } from "@/hooks/useProfile";
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
function Feeds() {
  const { profile } = useProfile();
  const [addPostModel, setAddPostModel] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  async function fetchPosts() {
    try {
      const res = await getPosts();
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error loading posts:", err);
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleAddPost(formData) {
    try {
      const res = await createPost(formData);
      if (res.ok) {
        const data = await res.json();
        setPosts([data.post, ...posts]);
        setAddPostModel(false);
        showSuccessToast(TOAST_MESSAGES.POST_CREATED);
      } else {
        const errorData = await res.json();
        showErrorToast(errorData.message || TOAST_MESSAGES.POST_CREATE_ERROR);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
    }
  }

  async function handleUpdatePost(postId, content, formData) {
    const selectedPost = posts.find((post) => post.id == postId);
    
    if (!formData.has("postId")) {
      formData.append("postId", postId);
    }

    try {
      const response = await updatePost(postId, content, formData);
      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        showErrorToast(result.message || TOAST_MESSAGES.POST_UPDATE_ERROR);
        return { success: false, message: result.message };
      }

      const newPosts = posts.map((post) => {
        if (post.id == postId) {
          return { ...selectedPost, ...result.post };
        } else {
          return post;
        }
      });

      setPosts(newPosts);
      showSuccessToast(TOAST_MESSAGES.POST_UPDATED);
      return { success: true };
    } catch (error) {
      console.error("Update post error:", error);
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
      return { success: false, message: "Network error occurred." };
    }
  }

  async function handleDeletePost(postId) {
    try {
      const res = await deletePost(postId);
      if (res.ok) {
        setPosts(posts.filter((p) => p.id != postId));
        showDeleteToast(TOAST_MESSAGES.POST_DELETED);
      } else {
        const errorData = await res.json();
        showErrorToast(errorData.message || TOAST_MESSAGES.POST_DELETE_ERROR);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
    }
  }

  const { goToArticleCreate } = useAppNavigation();
  return (
    <div className="px-3 xl:px-5 py-9 flex gap-5 w-full bg-gray-100">
      <div className="w-[21%] sm:block sm:w-[23%] py-5">
        <div className="h-fit">
          <Profile user={profile} />
        </div>
        <div className="w-full my-5">
          <Card padding={1}>
            <div className="w-full flex justify-between">
              <div>Profile Viewers</div>
              <div className="text-blue-900">25</div>
            </div>
            <div className="w-full flex justify-between">
              <div>Post Impressions</div>
              <div className="text-blue-900">90</div>
            </div>
          </Card>
        </div>
      </div>
      <div className="w-[100%] py-5 sm:w-[50%]">
        <div>
          <Card padding={1}>
            <div className="flex gap-2 items-center"
            onClick={() => setAddPostModel(true)}>
              <img
                src={profile?.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"}
                alt="image"
                className="rounded-full border-2 h-16 w-16 border-white cursor-pointer object-cover bg-white"
              />
              <input
                readOnly
                className="w-full border p-3 rounded-3xl cursor-pointer hover:bg-gray-100 "
                placeholder="Start a post..."
              />
            </div>
            <div className="w-full flex mt-3">
              <div 
                onClick={() => setAddPostModel(true)}
                className="flex items-center gap-2 p-2 justify-center rounded-lg hover:border w-[33%] hover:bg-gray-100 cursor-pointer font-semibold text-gray-600"
              >
                <VideocamOutlinedIcon className="text-green-600" /> Video
              </div>
              <div 
                onClick={() => setAddPostModel(true)}
                className="flex items-center gap-2 p-2 justify-center rounded-lg hover:border w-[33%] hover:bg-gray-100 cursor-pointer font-semibold text-gray-600"
              >
                <PhotoOutlinedIcon className="text-blue-500" /> Image
              </div>
              <div
                onClick={goToArticleCreate}
                className="flex items-center gap-2 p-2 justify-center rounded-lg hover:border w-[33%] hover:bg-gray-100 cursor-pointer font-semibold text-gray-600"
              >
                <ArticleOutlinedIcon className="text-orange-600" /> Article
              </div>
            </div>
          </Card>
        </div>
        {addPostModel && (
          <Model title={""} onClose={() => setAddPostModel(false)}>
            <div>
              <AddModel onPost={handleAddPost} />
            </div>
          </Model>
        )}
        <div className="border border-gray-400 w-[100%] my-5" />
        
        {/* Error States */}
        {error && <div className="text-center my-5 text-red-500">{error}</div>}

        <div className="w-full flex flex-col gap-5">
          {posts && posts.map((post) =>
            post.type === "article" ? (
              <ArticleCard key={post.id} article={post} />
            ) : (
              <Post 
                key={post.id} 
                post={post} 
                onEdit={handleUpdatePost} 
                onDelete={handleDeletePost} 
              />
            ),
          )}
        </div>
      </div>

      <div className="w-[26%] py-5 md:block">
        <div>
          <Card padding={1}>
            <div className="text-xl">LinkedIn News</div>
            <div className="text-gray-600">Top stories</div>
            <div className="my-1">
              <div className="text-md">Buffett to remain Berkshire chair</div>
              <div className="text-xs text-gray-400">2h ago</div>
            </div>
            <div className="my-1">
              <div className="text-md">Foreign invertment surge again</div>
              <div className="text-xs text-gray-400">3h ago</div>
            </div>
          </Card>
        </div>
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
}

export default function WrappedFeeds() {
  return <PrivateRoute><Feeds /></PrivateRoute>;
}
