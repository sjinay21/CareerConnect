"use client";
import React, { useState } from 'react';
import Navbar2 from '@/components/layout/navbar2';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutUser } from "@/utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
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

  const tabs = [
    { id: 'account', label: 'Account preferences', icon: <PersonIcon className="w-5 h-5 mr-3" /> },
    { id: 'security', label: 'Sign in & security', icon: <SecurityIcon className="w-5 h-5 mr-3" /> },
    { id: 'visibility', label: 'Visibility', icon: <VisibilityIcon className="w-5 h-5 mr-3" /> },
    { id: 'privacy', label: 'Data privacy', icon: <PrivacyTipIcon className="w-5 h-5 mr-3" /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar2 />
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
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-4 text-left transition-colors duration-150 ${
                      activeTab === tab.id
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
                      <div className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Name, location, and industry</p>
                          <p className="text-sm text-gray-500">Choose how your name and profile appear to others.</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Site preferences</h4>
                      <div className="flex justify-between items-center group cursor-pointer mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Language</p>
                          <p className="text-sm text-gray-500">English (English)</p>
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
                      <div className="flex justify-between items-center group cursor-pointer mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email addresses</p>
                          <p className="text-sm text-gray-500">Add or remove email addresses on your account</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>
                      <div className="flex justify-between items-center group cursor-pointer mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone numbers</p>
                          <p className="text-sm text-gray-500">Add a phone number to help keep your account secure</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>
                      <div className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Change password</p>
                          <p className="text-sm text-gray-500">Choose a unique password to protect your account</p>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600 font-medium text-sm transition-colors">Change</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'visibility' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Visibility</h3>
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
