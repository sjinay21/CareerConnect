"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from "@/Route/privateroute";
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutUser, getUserProfile, getProfileViewers, updateUserProfile } from "@/utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Profile views & viewers state for Visibility tab
  const [profileViewsCount, setProfileViewsCount] = useState(0);
  const [viewers, setViewers] = useState([]);
  const [viewersLoading, setViewersLoading] = useState(false);
  const [viewersError, setViewersError] = useState(null);

  // Modals state
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nameFormData, setNameFormData] = useState({ name: '', location: '' });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailFormData, setEmailFormData] = useState({ email: '' });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Fetch current user details on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const res = await getUserProfile();
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            setNameFormData({
              name: data.user.name || '',
              location: data.user.location || ''
            });
            setEmailFormData({
              email: data.user.email || ''
            });
          }
        }
      } catch (err) {
        console.error("Error fetching user data in settings:", err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['account', 'security', 'visibility', 'privacy', 'notifications'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState(null, '', url.toString());
    }
  };

  useEffect(() => {
    if (activeTab === 'visibility') {
      fetchVisibilityData();
    }
  }, [activeTab]);

  const fetchVisibilityData = async () => {
    try {
      setViewersLoading(true);
      setViewersError(null);

      const [profileRes, viewersRes] = await Promise.all([
        getUserProfile(),
        getProfileViewers(),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfileViewsCount(profileData.profileViews ?? 0);
        if (profileData.user) {
          setCurrentUser(profileData.user);
        }
      }

      if (viewersRes.ok) {
        const viewersData = await viewersRes.json();
        setViewers(viewersData.viewers || []);
      } else {
        setViewersError("Unable to load profile viewers.");
      }
    } catch (err) {
      console.error("Error fetching visibility data:", err);
      setViewersError("Failed to fetch profile viewers.");
    } finally {
      setViewersLoading(false);
    }
  };

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

  // 1. Name & Location Update Handlers
  const openNameModal = () => {
    setNameFormData({
      name: currentUser?.name || '',
      location: currentUser?.location || ''
    });
    setModalError('');
    setIsNameModalOpen(true);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    const trimmedName = nameFormData.name.trim();
    if (!trimmedName) {
      setModalError("Name cannot be empty.");
      return;
    }

    setModalSubmitting(true);
    setModalError('');
    try {
      const res = await updateUserProfile({
        name: trimmedName,
        location: nameFormData.location.trim()
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(prev => ({
          ...prev,
          name: data.user.name,
          location: data.user.location
        }));
        showSuccessToast("Profile information updated successfully");
        setIsNameModalOpen(false);
      } else {
        setModalError(data.message || "Failed to update profile information.");
      }
    } catch (err) {
      setModalError("Network error occurred while updating profile.");
    } finally {
      setModalSubmitting(false);
    }
  };

  // 2. Email Update Handlers
  const openEmailModal = () => {
    setEmailFormData({
      email: currentUser?.email || ''
    });
    setModalError('');
    setIsEmailModalOpen(true);
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    const trimmedEmail = emailFormData.email.trim();
    if (!trimmedEmail) {
      setModalError("Email address cannot be empty.");
      return;
    }

    setModalSubmitting(true);
    setModalError('');
    try {
      const res = await updateUserProfile({
        email: trimmedEmail
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(prev => ({
          ...prev,
          email: data.user.email
        }));
        showSuccessToast("Email address updated successfully");
        setIsEmailModalOpen(false);
      } else {
        setModalError(data.message || "Failed to update email.");
      }
    } catch (err) {
      setModalError("Network error occurred while updating email.");
    } finally {
      setModalSubmitting(false);
    }
  };

  // 3. Password Update Handlers
  const openPasswordModal = () => {
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setModalError('');
    setIsPasswordModalOpen(true);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordFormData.currentPassword) {
      setModalError("Please enter your current password.");
      return;
    }
    if (!passwordFormData.newPassword || passwordFormData.newPassword.length < 6) {
      setModalError("New password must be at least 6 characters long.");
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setModalError("New passwords do not match.");
      return;
    }

    setModalSubmitting(true);
    setModalError('');
    try {
      const res = await updateUserProfile({
        currentPassword: passwordFormData.currentPassword,
        password: passwordFormData.newPassword
      });
      const data = await res.json();
      if (res.ok) {
        showSuccessToast("Password changed successfully");
        setIsPasswordModalOpen(false);
      } else {
        setModalError(data.message || "Failed to change password.");
      }
    } catch (err) {
      setModalError("Network error occurred while changing password.");
    } finally {
      setModalSubmitting(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account preferences', icon: <PersonIcon className="w-5 h-5 mr-3" /> },
    { id: 'security', label: 'Sign in & security', icon: <SecurityIcon className="w-5 h-5 mr-3" /> },
    { id: 'visibility', label: 'Visibility', icon: <VisibilityIcon className="w-5 h-5 mr-3" /> },
    { id: 'privacy', label: 'Data privacy', icon: <PrivacyTipIcon className="w-5 h-5 mr-3" /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
              </div>
              <nav className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center px-4 py-4 text-left transition-colors duration-150 ${
                      activeTab == tab.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex w-full items-center px-4 py-4 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <LogoutIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 min-h-[500px]">
              {activeTab === 'account' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Account preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Profile information</h4>
                      <div className="flex justify-between items-center group hover:bg-gray-50 p-3 -mx-2 rounded-lg transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Name, location, and industry</p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {userLoading ? (
                              <span className="text-gray-400">Loading your profile...</span>
                            ) : currentUser?.name ? (
                              <span>
                                <strong className="text-gray-800 font-medium">{currentUser.name}</strong>
                                {currentUser.location && (
                                  <span className="text-gray-500"> • {currentUser.location}</span>
                                )}
                              </span>
                            ) : (
                              "Choose how your name and profile appear to others."
                            )}
                          </p>
                        </div>
                        <button
                          onClick={openNameModal}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors px-3 py-1.5 rounded hover:bg-blue-50"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Site preferences</h4>
                      <div className="flex justify-between items-center group cursor-pointer mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Language</p>
                          <p className="text-sm text-gray-500">English </p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>
                      <div className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Content language</p>
                          <p className="text-sm text-gray-500">Select languages for translation.</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Sign in & security</h3>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Account access</h4>
                      <div className="flex justify-between items-center group hover:bg-gray-50 p-3 -mx-2 rounded-lg transition-colors mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Email addresses</p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {userLoading ? (
                              <span className="text-gray-400">Loading email...</span>
                            ) : currentUser?.email ? (
                              <span className="text-gray-800 font-medium">{currentUser.email}</span>
                            ) : (
                              "Add or remove email addresses on your account"
                            )}
                          </p>
                        </div>
                        <button
                          onClick={openEmailModal}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors px-3 py-1.5 rounded hover:bg-blue-50"
                        >
                          Change
                        </button>
                      </div>

                      <div className="flex justify-between items-center group cursor-pointer mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone numbers</p>
                          <p className="text-sm text-gray-500">Add a phone number to help keep your account secure</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>

                      <div className="flex justify-between items-center group hover:bg-gray-50 p-3 -mx-2 rounded-lg transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Change password</p>
                          <p className="text-sm text-gray-500 mt-0.5">Choose a unique password to protect your account</p>
                        </div>
                        <button
                          onClick={openPasswordModal}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors px-3 py-1.5 rounded hover:bg-blue-50"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'visibility' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Visibility</h3>
                  <p className="text-gray-600 mb-6">Control who can see your profile and network.</p>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Visibility of your profile & network</h4>
                      <div className="flex justify-between items-center group cursor-pointer mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Profile viewing options</p>
                          <p className="text-sm text-gray-500">Choose whether you're visible or viewing in private mode</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>
                    </div>

                    {/* Who's viewed your profile & Profile views */}
                    <div className="pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">Who's viewed your profile</h4>
                          <p className="text-sm text-gray-500">See members who recently visited your profile and track overall visits</p>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full ">
                          <span className="text-lg font-semibold text-blue-600 ">Profile views:</span>
                          <span className="text-lg font-bold text-blue-700">
                            {profileViewsCount ?? 0}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 sm:p-5">
                        <div className="text-xs font-semibold text-gray-500 mb-4">
                          Recent Viewers
                        </div>

                        {viewersLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
                                <div className="flex-1 space-y-2">
                                  <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : viewersError ? (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {viewersError}
                          </div>
                        ) : viewers.length === 0 ? (
                          <div className="text-center py-8 px-4 bg-white rounded-lg border border-dashed border-gray-300">
                            <VisibilityIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-700">
                              No profile views yet
                            </p>
                            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                              When other members visit your profile, their details will appear here.
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
                            {viewers.map((viewer) => (
                              <div
                                key={viewer.view_id || `${viewer.viewer_id}-${viewer.viewed_at}`}
                                onClick={() => router.push(`/profile/${viewer.viewer_id}`)}
                                className="flex items-center justify-between gap-3 p-3 bg-white hover:bg-blue-50/50 rounded-lg border border-gray-200 hover:border-blue-200 transition cursor-pointer group shadow-sm"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={
                                      viewer.profile_picture_url ||
                                      "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                                    }
                                    alt={viewer.name || "Viewer"}
                                    className="w-11 h-11 rounded-full object-cover shrink-0 border border-gray-200 hover:underline hover:underline-blue-500/30 transition"
                                  />
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline ">
                                      {viewer.name}
                                    </div>
                                    <div className="text-xs text-gray-500 max-w-[280px] sm:max-w-md">
                                      {viewer.summary || "LinkedIn Member"}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-blue-600 hover:underline hidden sm:inline">
                                  View profile →
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Data privacy</h3>
                  <p className="text-gray-600 mb-6">Manage how your data is used and shared.</p>
                  <div className="flex justify-between items-center group cursor-pointer pb-6 border-b border-gray-200 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage your data and activity</p>
                      <p className="text-sm text-gray-500">Review the data that we have about you and who it's shared with</p>
                    </div>
                    <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Review</button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Notifications</h3>
                  <p className="text-gray-600 mb-6">Choose how and when you want to be notified.</p>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow cursor-pointer bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-800">In-app notifications</p>
                          <p className="text-sm text-gray-500 mt-1">Receive alerts in the notification tab for new connections, messages, and posts.</p>
                        </div>
                        <span className="text-sm text-blue-600 font-semibold px-3 py-1 bg-blue-100 rounded-full shrink-0 ml-4">On</span>
                     </div>
                     <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow cursor-pointer bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-800">Message alerts</p>
                          <p className="text-sm text-gray-500 mt-1">Show a badge when you receive a new direct message from a connection.</p>
                        </div>
                        <span className="text-sm text-blue-600 font-semibold px-3 py-1 bg-blue-100 rounded-full shrink-0 ml-4">On</span>
                     </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Modal 1: Edit Name & Location */}
      {isNameModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Edit Name & Location</h2>
              <button 
                onClick={() => setIsNameModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdateName} className="p-6">
              {modalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {modalError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameFormData.name}
                    onChange={(e) => setNameFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={nameFormData.location}
                    onChange={(e) => setNameFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g. San Francisco, CA or London, UK"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNameModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
                  disabled={modalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
                >
                  {modalSubmitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Change Email Address */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Change Email Address</h2>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdateEmail} className="p-6">
              {modalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {modalError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    New Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailFormData.email}
                    onChange={(e) => setEmailFormData({ email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter new email address"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    This will become the primary email you use to sign in.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
                  disabled={modalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
                >
                  {modalSubmitting ? "Updating..." : "Update email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Change Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="p-6">
              {modalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {modalError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Retype New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => setPasswordFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
                  disabled={modalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
                >
                  {modalSubmitting ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden ">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Logout</h2>
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                ✕
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

export default function WrappedSettingsPage() {
  return (
    <PrivateRoute>
      <SettingsPage />
    </PrivateRoute>
  );
}
