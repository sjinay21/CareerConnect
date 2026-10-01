"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import Advertisement from "@/components/feed/advertisement";
import Card from "@/components/shared/card";
import EditIcon from "@mui/icons-material/Edit";
import Experience from "@/components/profile/experience";
import Textarea from "@/components/ui/textarea";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import { updateUserProfile, getPosts, updatePost, deletePost, getConnections } from "@/utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";
import Post from "@/components/feed/post";

function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [editProfile, setEditProfile] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    summary: "",
    location: "",
    about: "",
    skill: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [posts, setPosts] = useState([]);
  const [connectionsCount, setConnectionsCount] = useState(0);

  useEffect(() => {
    async function fetchConnectionsCount() {
      try {
        const res = await getConnections();
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setConnectionsCount(data.length);
          }
        }
      } catch (e) {
        console.error("Error fetching connections:", e);
      }
    }
    fetchConnectionsCount();
  }, []);

  useEffect(() => {
    if (profile && profile.id) {
      async function fetchUserPosts() {
        try {
          const res = await getPosts();
          if (res.ok) {
            const data = await res.json();
            const filteredPosts = (data.posts || []).filter(p => p.authorId == profile.id);
            setPosts(filteredPosts);
          }
        } catch (e) {
          console.error("Error fetching user posts:", e);
        }
      }
      fetchUserPosts();
    }
  }, [profile?.id]);

  async function handleUpdatePost(postId, content, formData) {
    const selectedPost = posts.find((post) => post.id == postId);
    if (!formData.has("postId")) formData.append("postId", postId);

    try {
      const response = await updatePost(postId, content, formData);
      const result = await response.json();
      if (!response.ok) {
        showErrorToast(result.message || TOAST_MESSAGES.POST_UPDATE_ERROR);
        return { success: false, message: result.message };
      }
      setPosts(posts.map((post) => post.id == postId ? { ...selectedPost, ...result.post } : post));
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
        setPosts(posts.filter((p) => p.id != postId));
        showSuccessToast("Post deleted successfully");
      } else {
        const errorData = await res.json();
        showErrorToast(errorData.message || TOAST_MESSAGES.POST_DELETE_ERROR);
      }
    } catch (err) {
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
    }
  }

  function openEditModal() {
    setEditData({
      name: profile.name || "",
      summary: profile.summary || "",
      location: profile.location || "",
      about: profile.about || "",
      skill: profile.skills || profile.skill || "",
    });
    setProfilePictureFile(null);
    setBannerFile(null);
    setEditProfile(true);
  }

  async function handleSave() {
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("about", editData.about);
      formData.append("summary", editData.summary);
      formData.append("location", editData.location);
      formData.append("skills", editData.skill);
      
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }
      
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      const res = await updateUserProfile(formData);
      if (res.ok) {
        const result = await res.json();
        if (result.user) {
          setProfile(result.user);
        } else {
          setProfile({ ...profile, ...editData });
        }
        setEditProfile(false);
        showSuccessToast(TOAST_MESSAGES.PROFILE_UPDATED);
      } else {
        showErrorToast(TOAST_MESSAGES.PROFILE_UPDATE_ERROR);
      }
    } catch (err) {
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
    }
  }

  return (
    <div className="w-full flex flex-col px-3 xl:px-5 py-5 bg-gray-100">
      <div className="flex justify-between">
        <div className="w-full md:w-[70%]">
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                  <div
                    onClick={openEditModal}
                    className="absolute top-3 right-3 z-20 w-[35px] h-[35px] rounded-full bg-white flex justify-center items-center cursor-pointer"
                  >
                    <EditIcon />
                  </div>
                  <img
                    src={profile.banner_url || "/images.jpg"}
                    alt="cover"
                    className="w-full h-[200px] rounded-tr-lg rounded-tl-lg object-cover"
                  />
                  <div className="absolute object-cover top-36 left-6 z-10 bg-white rounded-full">
                    <img
                      src={profile.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"}
                      alt="profile"
                      className="rounded-full border-2 h-20 w-20 border-white cursor-pointer object-cover"
                    />
                  </div>
                </div>
                <div className="mt-10 relative px-8 py-2">
                  <div
                    onClick={openEditModal}
                    className="absolute top-0 right-3 z-20 w-[35px] h-[35px] rounded-full bg-white flex justify-center items-center cursor-pointer"
                  >
                    <EditIcon />
                  </div>
                  <div className="w-full">
                    <div className="text-2xl">{profile.name}</div>
                    <div className="text-gray-700">{profile.summary}</div>
                    <div className="text-sm text-gray-500">
                      {profile.location}
                    </div>
                    <div className="text-md text-blue-500 w-fit cursor-pointer hover:underline">
                      {connectionsCount} Connection{connectionsCount !== 1 ? 's' : ''}
                    </div>
                    <div className="md:flex w-full justify-between">
                      <div className="my-5 flex gap-5">
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Open to
                        </div>
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Share
                        </div>
                      </div>
                      <div className="my-5 flex gap-5">
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Message
                        </div>
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Connect
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5">
            <Card padding={1}>
              <div className="flex items-center justify-between">
                <div className="text-xl">About</div>
                <div onClick={openEditModal} className="cursor-pointer">
                  <EditIcon />
                </div>
              </div>
              <div className="text-gray-700 text-md w-[80%]">
                {profile.about}
              </div>
            </Card>
          </div>
          <div className="my-5">
            <Card padding={1}>
              <div className="flex items-center justify-between">
                <div className="text-xl">Skill</div>
                <div onClick={openEditModal} className="cursor-pointer">
                  <EditIcon />
                </div>
              </div>
                  <div className="text-gray-700 text-md w-[80%]">
                {profile.skill}
              </div>
            </Card>
          </div>

          <Experience />

          {posts.length > 0 && (
            <div className="my-5 flex flex-col gap-5">
              <div className="text-xl font-semibold mb-2">Activity ({posts.length} posts)</div>
              {posts.map((post) => (
                <Post 
                  key={post.id} 
                  post={post} 
                  onEdit={handleUpdatePost} 
                  onDelete={handleDeletePost} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex md:w-[28%]">
          <div className="my-5 sticky top-19">
            <Advertisement />
          </div>
        </div>
      </div>

      {editProfile && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto rounded-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="text-2xl font-semibold text-black">Edit Profile</div>
              <div
                onClick={() => setEditProfile(false)}
                className="text-3xl cursor-pointer"
              >
                ×
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">Name</label>
              <Input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
                variant="outline"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">Profile Picture</label>
              <label className="w-full border border-black rounded-lg p-2 flex items-center gap-3 cursor-pointer ">
                <div className="bg-gray-200 text-black px-3 py-1 rounded-md text-sm font-medium border border-gray-300">
                  Choose File
                </div>
                <span className="text-black text-sm truncate flex-1">
                  {profilePictureFile ? profilePictureFile.name : "No file chosen"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePictureFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">Banner Image</label>
              <label className="w-full border border-black rounded-lg p-2 flex items-center gap-3 cursor-pointer">
                <div className="bg-gray-200 text-black px-3 py-1 rounded-md text-sm font-medium border border-gray-300">
                  Choose File
                </div>
                <span className="text-black text-sm flex-1">
                  {bannerFile ? bannerFile.name : "No file chosen"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">Summary</label>
              <Input
                type="text"
                value={editData.summary}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    summary: e.target.value,
                  })
                }
                variant="outline"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">Location</label>
              <Input
                type="text"
                value={editData.location}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    location: e.target.value,
                  })
                }
                variant="outline"/>
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-semibold text-black">About</label>
              <Textarea
                value={editData.about}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    about: e.target.value,
                  })
                }
                rows="5"
                variant="default"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-1 font-semibold text-black">Skill</label>
              <Textarea
                value={editData.skill}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    skill: e.target.value,
                  })
                }
                rows="5"
                variant="default"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Buttonvariants
                onClick={() => setEditProfile(false)}
                variant="cancel"
              >
                Cancel
              </Buttonvariants>

              <Buttonvariants
                onClick={handleSave}
                variant="psend"
              >
                Save
              </Buttonvariants>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WrappedProfilePage() {
  return <PrivateRoute><ProfilePage /></PrivateRoute>;
}
