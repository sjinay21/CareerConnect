"use client";
import React, { useState, useEffect } from 'react';
import PrivateRoute from "@/Route/privateroute";
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import { logoutUser, getUserProfile, getProfileViewers, updateUserProfile } from "@/utils/api";
import ProfileViewsGraph from "@/components/ui/ProfileViewsGraph";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";
import { Formik, Form, Field } from "formik";
import { updateNameSchema, UpdateEmailSchema, updatePasswordSchema } from "@/schemas/authSchema";
import { useAppNavigation, ROUTES } from "@/hooks/useNavigation";

function SettingsPage() {
  const { goToProfile, goToPlan } = useAppNavigation();
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
  const [viewersLock, setViewersLock] = useState(null);
  const [periodLock, setPeriodLock] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  // Modals state
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
      setViewersLock(null);
      setPeriodLock(null);

      // 1. Fetch user profile
      const profileRes = await getUserProfile();
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.user) {
          setCurrentUser(profileData.user);
        }
      }

      // 2. Fetch default profile viewers without period parameter (backend default is 30 days)
      const viewersRes = await getProfileViewers();

      if (viewersRes.ok) {
        const viewersData = await viewersRes.json();
        setProfileViewsCount(viewersData.total ?? 0);
        setViewers(viewersData.viewers || []);
      } else if (viewersRes.status === 403) {
        const errData = await viewersRes.json().catch(() => null);
        setViewersLock({
          message: errData?.message || "Viewing profile visitors is not included in your current subscription plan.",
          code: errData?.code,
          requiredFeature: errData?.requiredFeature,
        });
      } else {
        const errData = await viewersRes.json().catch(() => null);
        setViewersError(errData?.message || "Unable to load profile viewers.");
      }
    } catch (err) {
      console.error("Error fetching visibility data:", err);
      setViewersError("Failed to fetch profile viewers.");
    } finally {
      setViewersLoading(false);
    }
  };

  const handlePeriodChange = async (newPeriod) => {
    setSelectedPeriod(newPeriod);
    setPeriodLock(null);

    try {
      setViewersLoading(true);
      setViewersError(null);

      const res = await getProfileViewers(newPeriod);

      if (res.ok) {
        const data = await res.json();
        setProfileViewsCount(data.total ?? 0);
        setViewers(data.viewers || []);
        setPeriodLock(null);
        setViewersLock(null);
      } else if (res.status === 403) {
        const errData = await res.json().catch(() => null);
        setPeriodLock({
          message: errData?.message || "Filtering viewers by custom periods is not included in your current subscription plan.",
          code: errData?.code,
          requiredFeature: errData?.requiredFeature,
        });
      } else {
        const errData = await res.json().catch(() => null);
        setViewersError(errData?.message || "Unable to load profile viewers.");
      }
    } catch (err) {
      console.error("Error fetching profile viewers for period:", err);
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
        window.location.href = ROUTES.LOGIN;
      }, 800);
    } catch (error) {
      console.error(error);
      showErrorToast("Logout failed");
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  // Modal Open Handlers
  const openNameModal = () => setIsNameModalOpen(true);
  const openEmailModal = () => setIsEmailModalOpen(true);
  const openPasswordModal = () => setIsPasswordModalOpen(true);

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
                    className={`flex items-center px-4 py-4 text-left transition-colors duration-150 ${activeTab == tab.id
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
                          <p className="text-sm font-semibold text-gray-900">Name and location</p>
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

                      {/*<div className="flex justify-between items-center group cursor-pointer mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone numbers</p>
                          <p className="text-sm text-gray-500">Add a phone number to help keep your account secure</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>*/}

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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-lg font-medium text-gray-800">Who's viewed your profile</h4>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Members who recently visited your profile in the past {selectedPeriod} days
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start sm:self-auto">
                          <select
                            value={selectedPeriod}
                            onChange={(e) => handlePeriodChange(Number(e.target.value))}
                            disabled={viewersLoading}
                            className="text-sm font-medium bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition cursor-pointer"
                          >
                            <option value={7}>Last 7 days</option>
                            <option value={30}>Last 30 days</option>
                            <option value={90}>Last 90 days</option>
                          </select>

                          {/* Profile views count */}
                          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                            <span className="text-sm sm:text-base font-semibold text-blue-600">Profile views:</span>
                            <span className="text-sm sm:text-base font-bold text-blue-700">
                              {profileViewsCount ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Period Filter Feature Lock Banner */}
                      {periodLock && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <LockIcon className="w-5 h-5 text-blue-600 shrink-0" />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-blue-900">
                                Period Filter Locked
                              </p>
                              <p className="text-xs text-blue-700">
                                {periodLock.message}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={goToPlan}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md shadow-sm transition whitespace-nowrap self-start sm:self-auto cursor-pointer"
                          >
                            View Available Plans
                          </button>
                        </div>
                      )}

                      {/* Profile Views Graph Component */}
                      <ProfileViewsGraph period={selectedPeriod} />

                      {/* Viewers List Container */}
                      <div className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xs font-semibold text-gray-500">
                            Recent Viewers ({selectedPeriod} days)
                          </div>
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
                        ) : viewersLock ? (
                          <div className="text-center py-8 px-4 bg-white rounded-lg border border-dashed border-gray-300">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                              <LockIcon className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                              Profile Viewers Locked
                            </p>
                            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto mb-4">
                              {viewersLock.message}
                            </p>
                            <button
                              onClick={goToPlan}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
                            >
                              View Available Plans
                            </button>
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
                            {viewers.map((viewer) => {
                              const isRestricted = !viewer.viewer_id;
                              return (
                                <div
                                  key={viewer.view_id || `${viewer.viewer_id}-${viewer.viewed_at}`}
                                  onClick={() => {
                                    if (!isRestricted && viewer.viewer_id) {
                                      goToProfile(viewer.viewer_id);
                                    } else {
                                      goToPlan();
                                    }
                                  }}
                                  className={`flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-gray-200 transition group shadow-sm ${
                                    isRestricted
                                      ? "hover:bg-blue-50/20 cursor-pointer hover:border-blue-200"
                                      : "hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {isRestricted ? (
                                      <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition">
                                        <LockIcon className="w-5 h-5" />
                                      </div>
                                    ) : (
                                      <img
                                        src={
                                          viewer.profile_picture_url ||
                                          "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                                        }
                                        alt={viewer.name || "Viewer"}
                                        className="w-11 h-11 rounded-full object-cover border border-gray-200"
                                      />
                                    )}
                                    <div className="min-w-0">
                                      <div className={`text-sm font-semibold ${isRestricted ? "text-gray-700" : "text-gray-900 group-hover:text-blue-600 group-hover:underline"}`}>
                                        {viewer.name}
                                      </div>
                                      <div className="text-xs text-gray-500 max-w-[280px] sm:max-w-md truncate">
                                        {viewer.summary || "LinkedIn Member"}
                                      </div>
                                    </div>
                                  </div>

                                  {isRestricted ? (
                                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
                                      Unlock with Premium
                                    </span>
                                  ) : (
                                    <span className="text-xs font-medium text-blue-600 group-hover:underline">
                                      View profile →
                                    </span>
                                  )}
                                </div>
                              );
                            })}
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
                      <span className="text-sm text-blue-600 font-semibold px-3 py-1 bg-blue-100 rounded-full ml-4">On</span>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow cursor-pointer bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-800">Message alerts</p>
                        <p className="text-sm text-gray-500 mt-1">Show a badge when you receive a new direct message from a connection.</p>
                      </div>
                      <span className="text-sm text-blue-600 font-semibold px-3 py-1 bg-blue-100 rounded-full ml-4">On</span>
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
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 ">
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

            <Formik
              initialValues={{
                name: currentUser?.name || '',
                location: currentUser?.location || ''
              }}
              validationSchema={updateNameSchema}
              enableReinitialize
              onSubmit={async (values, { setSubmitting, setStatus, setFieldError }) => {
                setStatus('');
                const trimmedName = values.name.trim();
                const trimmedLocation = (values.location || '').trim();

                if (
                  trimmedName === (currentUser?.name || '').trim() &&
                  trimmedLocation === (currentUser?.location || '').trim()
                ) {
                  setFieldError("name", "New name cannot be the same as current name");
                  setFieldError("location", "New location cannot be the same as current location");
                  showErrorToast("No changes detected to update.");
                  setSubmitting(false);
                  return;
                }

                try {
                  const res = await updateUserProfile({
                    name: trimmedName,
                    location: trimmedLocation
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
                    const errorMsg = data.message || "Failed to update profile information.";
                    setStatus(errorMsg);
                    showErrorToast(errorMsg);
                  }
                } catch (err) {
                  const errorMsg = "Network error occurred while updating profile.";
                  setStatus(errorMsg);
                  showErrorToast(errorMsg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, status, submitCount }) => (
                <Form className="p-6">
                  {status && (
                    <p className="text-red-500 text-xs mb-3">{status}</p>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="Enter your name"
                      />
                      {errors.name && (touched.name || submitCount > 0) && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Location<span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="location"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="e.g. Mumbai, India"
                      />
                      {errors.location && (touched.location || submitCount > 0) && (
                        <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsNameModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal 2: Change Email Address */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
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

            <Formik
              initialValues={{
                email: currentUser?.email || ''
              }}
              validationSchema={UpdateEmailSchema(currentUser?.email)}
              enableReinitialize
              onSubmit={async (values, { setSubmitting, setStatus, setFieldError }) => {
                setStatus('');
                const trimmedEmail = values.email.trim();

                if (currentUser?.email && trimmedEmail.toLowerCase() === currentUser.email.toLowerCase()) {
                  const errorMsg = "New email cannot be the same as your current email.";
                  setFieldError("email", errorMsg);
                  showErrorToast(errorMsg);
                  setSubmitting(false);
                  return;
                }

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
                    const errorMsg = data.message || "Failed to update email.";
                    setStatus(errorMsg);
                    showErrorToast(errorMsg);
                  }
                } catch (err) {
                  const errorMsg = "Network error occurred while updating email.";
                  setStatus(errorMsg);
                  showErrorToast(errorMsg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, status, submitCount }) => (
                <Form className="p-6">
                  {status && (
                    <p className="text-red-500 text-xs mb-3">{status}</p>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        New Email Address <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="Enter new email address"
                      />
                      {errors.email && (touched.email || submitCount > 0) && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
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
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Updating..." : "Update email"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal 3: Change Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              }}
              validationSchema={updatePasswordSchema}
              onSubmit={async (values, { setSubmitting, setStatus, setFieldError }) => {
                setStatus('');
                if (values.currentPassword === values.newPassword) {
                  const errorMsg = "New password cannot be the same as current password";
                  setFieldError("newPassword", errorMsg);
                  showErrorToast(errorMsg);
                  setSubmitting(false);
                  return;
                }

                try {
                  const res = await updateUserProfile({
                    currentPassword: values.currentPassword,
                    password: values.newPassword
                  });
                  const data = await res.json();
                  if (res.ok) {
                    showSuccessToast("Password changed successfully");
                    setIsPasswordModalOpen(false);
                  } else {
                    const errorMsg = data.message || "Failed to change password.";
                    setStatus(errorMsg);
                    showErrorToast(errorMsg);
                  }
                } catch (err) {
                  const errorMsg = "Network error occurred while changing password.";
                  setStatus(errorMsg);
                  showErrorToast(errorMsg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, status, submitCount }) => (
                <Form className="p-6">
                  {status && (
                    <p className="text-red-500 text-xs mb-3">{status}</p>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="password"
                        name="currentPassword"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="Enter current password"
                      />
                      {errors.currentPassword && touched.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="password"
                        name="newPassword"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="Minimum 6 characters"
                      />
                      {errors.newPassword && touched.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Retype New Password <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Updating..." : "Update password"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
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
