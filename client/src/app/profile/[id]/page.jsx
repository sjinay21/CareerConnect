"use client";
import PrivateRoute from "@/Route/privateroute";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import Advertisement from "@/components/feed/advertisement";
import Card from "@/components/shared/card";
import EditIcon from "@mui/icons-material/Edit";
import Experience from "@/components/profile/experience";
import Textarea from "@/components/ui/textarea";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import {
  getUserById,
  getUserProfile,
  getPosts,
  updatePost,
  deletePost,
  getConnections,
  updateUserProfile,
  createOrGetConversation,
  logoutUser,
} from "@/utils/api";
import {
  TOAST_MESSAGES,
  showSuccessToast,
  showErrorToast,
} from "@/components/ui/toastUtils";
import Post from "@/components/feed/post";

function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;
  const { profile: loggedInUser } = useProfile();
  const [profile, setProfile] = useState(null);
  const [profileViewsCount, setProfileViewsCount] = useState(null);

  const isOwnProfile =
    loggedInUser?.id != null &&
    profile?.id != null &&
    loggedInUser.id == profile.id;
  const [editProfile, setEditProfile] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    summary: "",
    location: "",
    about: "",
    skills: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [posts, setPosts] = useState([]);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      localStorage.removeItem("profileComplete");
      showSuccessToast(TOAST_MESSAGES.LOGOUT_SUCCESS);
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (error) {
      console.error(error);
      showErrorToast("Logout failed");
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  useEffect(() => {
    if (!userId || !loggedInUser?.id) return;

    async function loadAllProfileData() {
      try {
        // 1. Fetch the user's profile
        let profileRes;
        if (userId == loggedInUser.id) {
          profileRes = await getUserProfile();
        } else {
          profileRes = await getUserById(userId);
        }

        let currentProfileId = null;
        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data.user) {
            setProfile(data.user);
            currentProfileId = data.user.id;
            setProfileViewsCount(data.profileViews ?? 0);
          }
        }

        // 2. Fetch the connections count
        if (currentProfileId) {
          try {
            const connRes = await getConnections(currentProfileId);
            if (connRes.ok) {
              const connData = await connRes.json();
              if (connData && connData.friends) {
                setConnectionsCount(connData.friends.length);
              }
            }
          } catch (e) {
            console.error("Error fetching connections:", e);
          }
        }

        // 3. Fetch the user's posts
        if (currentProfileId) {
          try {
            const postsRes = await getPosts();
            if (postsRes.ok) {
              const postsData = await postsRes.json();
              const filteredPosts = (postsData.posts || []).filter(
                (p) => p.authorId == currentProfileId,
              );
              setPosts(filteredPosts);
            }
          } catch (e) {
            console.error("Error fetching user posts:", e);
          }
        }
      } catch (error) {
        showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
      }
    }

    loadAllProfileData();
  }, [userId, loggedInUser?.id]);

  async function handleUpdatePost(postId, content, formData) {
    if (!isOwnProfile) {
      return { success: false, message: "You cannot edit this post." };
    }

    const selectedPost = posts.find((post) => post.id == postId);
    if (!formData.has("postId")) formData.append("postId", postId);

    try {
      const response = await updatePost(postId, content, formData);
      const result = await response.json();
      if (!response.ok) {
        showErrorToast(result.message || TOAST_MESSAGES.POST_UPDATE_ERROR);
        return { success: false, message: result.message };
      }
      setPosts(
        posts.map((post) =>
          post.id == postId ? { ...selectedPost, ...result.post } : post,
        ),
      );
      showSuccessToast(TOAST_MESSAGES.POST_UPDATED);
      return { success: true };
    } catch (error) {
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
      return { success: false, message: "Network error occurred." };
    }
  }

  async function handleDeletePost(postId) {
    if (!isOwnProfile) return;

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

  const handleMessage = async () => {
    if (!profile?.id) return;
    try {
      const response = await createOrGetConversation(profile.id);
      if (response.ok) {
        router.push("/messages");
      }
    } catch (error) {
      console.error("Error creating/getting conversation", error);
    }
  };

  function openEditModal() {
    if (!isOwnProfile) return;

    setEditData({
      name: profile.name || "",
      summary: profile.summary || "",
      location: profile.location || "",
      about: profile.about || "",
      skills: profile.skills || "",
    });
    setProfilePictureFile(null);
    setBannerFile(null);
    setEditProfile(true);
  }

  async function handleSave() {
    if (!isOwnProfile) return;

    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("about", editData.about);
      formData.append("summary", editData.summary);
      formData.append("location", editData.location);
      formData.append("skills", editData.skills);

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

  if (!profile) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Profile not found.</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-9 flex flex-col md:flex-row gap-5 md:gap-0">
        <div className="w-full md:w-[72%] md:pr-5">
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                  {isOwnProfile && (
                    <div
                      onClick={openEditModal}
                      className="absolute top-3 right-3 z-20 w-[35px] h-[35px] rounded-full bg-white flex justify-center items-center cursor-pointer"
                    >
                      <EditIcon />
                    </div>
                  )}
                  <img
                    src={profile.banner_url || "/images.jpg"}
                    alt="cover"
                    className="w-full h-[200px] rounded-tr-lg rounded-tl-lg object-cover"
                  />
                  <div className="absolute object-cover top-36 left-6 z-10 bg-white rounded-full">
                    <img
                      src={
                        profile.profile_picture_url ||
                        "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                      }
                      alt="profile"
                      className="rounded-full border-2 h-20 w-20 border-white cursor-pointer object-cover"
                    />
                  </div>
                </div>
                <div className="mt-10 relative px-8 py-2">
                  {isOwnProfile && (
                    <div
                      onClick={openEditModal}
                      className="absolute top-0 right-3 z-20 w-[35px] h-[35px] rounded-full bg-white flex justify-center items-center cursor-pointer"
                    >
                      <EditIcon />
                    </div>
                  )}
                  <div className="w-full">
                    <div className="text-2xl">{profile.name}</div>
                    <div className="text-gray-700">{profile.summary}</div>
                    <div className="text-sm text-gray-500">
                      {profile.location}
                    </div>
                    {isOwnProfile && (
                      <div className="text-md text-blue-500 w-fit cursor-pointer hover:underline">
                        {connectionsCount} Connection
                        {connectionsCount !== 1 ? "s" : ""}
                      </div>
                    )}
                    <div className="md:flex w-full justify-between">
                      <div className="my-5 flex gap-5 md:gap-0">
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold mr-4">
                          Open to
                        </div>
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold mr-4">
                          Share
                        </div>
                      </div>
                      <div className="my-5 flex gap-5 md:gap-0">
                        {!isOwnProfile && (
                          <>
                            <div
                              onClick={handleMessage}
                              className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold mr-4"
                            >
                              Message
                            </div>
                            <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                              Connect
                            </div>
                          </>
                        )}
                        {isOwnProfile && (
                          <div
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="cursor-pointer px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white font-semibold transition-colors"
                          >
                            Logout
                          </div>
                        )}
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
                {isOwnProfile && (
                  <div onClick={openEditModal} className="cursor-pointer">
                    <EditIcon />
                  </div>
                )}
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
                {isOwnProfile && (
                  <div onClick={openEditModal} className="cursor-pointer">
                    <EditIcon />
                  </div>
                )}
              </div>
              <div className="text-gray-700 text-md w-[80%]">
                {profile.skills}
              </div>
            </Card>
          </div>

          {/* OLD IMPLEMENTATION */}
          {/* Replaced because Experience needs to fetch dynamic user's experiences, not just the logged in user's */}
          {/* <Experience /> */}

          {/* NEW IMPLEMENTATION */}
          <Experience userId={profile.id} isOwnProfile={isOwnProfile} />

          {posts.length > 0 && (
            <div className="my-5 flex flex-col gap-5 md:gap-0">
              <div className="text-xl font-semibold mb-2">
                Activity ({posts.length} posts)
              </div>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onEdit={isOwnProfile ? handleUpdatePost : undefined}
                  onDelete={isOwnProfile ? handleDeletePost : undefined}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col gap-4 md:w-[28%] my-5">
          <div className="sticky top-19 flex flex-col gap-4 w-full">
            <Advertisement />
            
            <Card padding={4}>
              <div className="font-semibold text-gray-800 mb-1">
                Profile views
              </div>
              <div className="text-gray-600 text-sm">
                {profileViewsCount === null 
                  ? "Loading views..." 
                  : `Profile views: ${profileViewsCount}`}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {editProfile && isOwnProfile && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto rounded-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="text-2xl font-semibold text-black">
                Edit Profile
              </div>
              <div
                onClick={() => setEditProfile(false)}
                className="text-3xl cursor-pointer"
              >
                ×
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Name
              </label>
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
              <label className="block mb-1 font-semibold text-black">
                Profile Picture
              </label>
              <label className="w-full border border-black rounded-lg p-2 flex items-center gap-3 cursor-pointer">
                <div className="bg-gray-200 text-black px-3 py-1 rounded-md text-sm font-medium border border-gray-300">
                  Choose File
                </div>
                <span className="text-black text-sm flex">
                  {profilePictureFile
                    ? profilePictureFile.name
                    : "No file chosen"}
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
              <label className="block mb-1 font-semibold text-black">
                Banner Image
              </label>
              <label className="w-full border border-black rounded-lg p-2 flex items-center gap-3 cursor-pointer">
                <div className="bg-gray-200 text-black px-3 py-1 rounded-md text-sm font-medium border border-gray-300">
                  Choose File
                </div>
                <span className="text-black text-sm w-full">
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
              <label className="block mb-1 font-semibold text-black">
                Summary
              </label>
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
              <label className="block mb-1 font-semibold text-black">
                Location
              </label>
              <Input
                type="text"
                value={editData.location}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    location: e.target.value,
                  })
                }
                variant="outline"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-semibold text-black">
                About
              </label>
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
              <label className="block mb-1 font-semibold text-black">
                Skills
              </label>
              <Textarea
                value={editData.skills}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    skills: e.target.value,
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

              <Buttonvariants onClick={handleSave} variant="psend">
                Save
              </Buttonvariants>
            </div>
          </div>
        </div>
      )}

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden ">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Logout</h2>
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-red-500 hover:text-red-700 transition-colors text-2xl leading-none pb-1"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <p className="text-lg text-center text-black font-medium mb-8 pb-6">
              Are you sure you want to logout?
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-6 py-2 bg-gray-50 border border-black rounded-md text-black font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WrappedProfilePage() {
  return (
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  );
}
