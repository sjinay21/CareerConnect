"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";
import { logoutUser } from "@/utils/api";
import { ROUTES, useAppNavigation } from "@/hooks/useNavigation";

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';

import Search from "@/components/shared/search";
import { useProfile } from "@/hooks/useProfile";

export default function Navbar2() {
  const { profile } = useProfile();
  const { goToFeeds, goToJobs, goToProfile, goToSettings, goToPlan, goToAdminDashboard } = useAppNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMeDropdownOpen, setIsMeDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const mainLinks = [
    { href: ROUTES.FEEDS, label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
    { href: ROUTES.NETWORK, label: "Network", icon: <PeopleIcon className="w-4 h-4" /> },
    { href: ROUTES.JOBS, label: "Jobs", icon: <WorkIcon className="w-4 h-4" /> },
    { href: ROUTES.MESSAGES, label: "Messaging", icon: <MessageIcon className="w-4 h-4" /> },
    { href: ROUTES.NOTIFICATION, label: "Notifications", icon: <NotificationsIcon className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white w-full border-b border-gray-200 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-[52px]">

        <div className="flex items-center flex-1 md:flex-none">
          <Link href={ROUTES.FEEDS} className="flex items-center cursor-pointer">
            <h3 className="text-blue-600 font-bold text-xl md:text-3xl hidden sm:block">
              Linked
            </h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10"
              alt="Linkedlogo"
              className="w-[34px] h-[34px] rounded cursor-pointer mx-2 sm:mx-0"
            />
          </Link>

          <div className="ml-2 md:ml-4 flex-1 max-w-[200px] md:max-w-none">
            <Search limit={5} />
          </div>
        </div>

        <div className="hidden md:flex items-center h-full gap-2 md:gap-4 lg:gap-6">
          {mainLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full px-2 md:px-3 lg:px-4 hover:border-b-2 hover:border-black transition-colors"
            >
              {link.icon}
              <span className="text-xs hidden lg:block mt-0.5">{link.label}</span>
            </Link>
          ))}

          <div className="relative h-full flex items-center border-l border-gray-200 pl-4 lg:pl-6 ml-2">
            <button
              onClick={() => setIsMeDropdownOpen(!isMeDropdownOpen)}
              className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full px-2"
            >
              <PersonIcon className="w-6 h-6 shrink-0" />
              <span className="flex items-center text-xs hidden lg:flex ">
                Me <ArrowDropDownIcon className="w-4 h-4 " />
              </span>
            </button>

            {isMeDropdownOpen && (
              <div className="absolute right-0 top-[53px] w-[280px] bg-white border border-gray-200 rounded-bl-lg rounded-br-lg shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-start gap-3">
                    <img src={profile?.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"} className="w-12 h-12 rounded-full object-cover shrink-0" alt="Profile" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{profile?.name || "User"}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">{profile?.summary || "Software Engineer"}</div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setIsMeDropdownOpen(false);
                      goToProfile(profile?.id);
                    }}
                    className="mt-3 block w-full text-center py-1 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    View profile
                  </div>
                </div>

                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="font-semibold text-gray-900 mb-2">Account</div>
                  <div
                    onClick={() => {
                      setIsMeDropdownOpen(false);
                      goToPlan();
                    }}
                    className="block text-sm text-[#915907] hover:underline mb-2 font-semibold cursor-pointer"
                  >
                    Try 1 month of Premium for ₹0
                  </div>
                  <div
                    onClick={() => {
                      setIsMeDropdownOpen(false);
                      goToSettings();
                    }}
                    className="block text-sm text-gray-600 hover:underline mb-2 py-1 cursor-pointer"
                  >
                    Settings & Privacy
                  </div>
                  <div className="block text-sm text-gray-600 hover:underline mb-2 py-1 cursor-pointer">Help</div>
                  <div className="block text-sm text-gray-600 hover:underline py-1 cursor-pointer">Language</div>
                </div>

                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="font-semibold text-gray-900 mb-2">Manage</div>
                  <div
                    onClick={() => {
                      setIsMeDropdownOpen(false);
                      goToFeeds();
                    }}
                    className="block text-sm text-gray-600 hover:underline mb-2 py-1 cursor-pointer"
                  >
                    Posts & Activity
                  </div>
                  <div
                    onClick={() => {
                      setIsMeDropdownOpen(false);
                      goToJobs();
                    }}
                    className="block text-sm text-gray-600 hover:underline py-1 cursor-pointer"
                  >
                    Job Posting Account
                  </div>
                  {profile?.role === 'admin' && (
                    <div
                      onClick={() => {
                        setIsMeDropdownOpen(false);
                        goToAdminDashboard();
                      }}
                      className="block text-sm text-blue-600 hover:underline py-1 mt-2 font-semibold cursor-pointer"
                    >
                      Admin Dashboard
                    </div>
                  )}
                </div>

                <div className="px-4 py-3">
                  <div onClick={() => { setIsMeDropdownOpen(false); setIsLogoutModalOpen(true); }} className="block text-sm text-red-600 hover:underline py-1 cursor-pointer font-semibold">
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href={ROUTES.PLAN} className="hidden lg:flex flex-col items-center justify-center text-xs text-[#915907] hover:text-[#5c3a06] hover:underline max-w-[80px] text-center ml-2 border-l border-gray-200 pl-4">
            <WorkspacePremiumIcon className="w-6 h-6" />
            <span className="mt-0.5">Plan</span>
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-black p-2"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3 py-2 border-b border-gray-200 mb-2">
              <img src={profile?.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"} className="w-10 h-10 rounded-full object-cover shrink-0" />
              <div>
                <div className="font-semibold">{profile?.name || "User"}</div>
                <div onClick={() => { setIsMobileMenuOpen(false); goToProfile(profile?.id); }} className="text-sm text-blue-600 hover:underline cursor-pointer">View profile</div>
              </div>
            </div>
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                goToSettings();
              }}
              className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md font-medium block cursor-pointer"
            >
              Settings & Privacy
            </div>
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                goToFeeds();
              }}
              className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md font-medium block cursor-pointer"
            >
              Posts & Activity
            </div>
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                goToJobs();
              }}
              className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md font-medium block cursor-pointer"
            >
              Job Posting Account
            </div>
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                goToPlan();
              }}
              className="text-[#915907] hover:bg-orange-50 px-3 py-2 rounded-md font-medium block cursor-pointer"
            >
              Try 1 month of Premium for ₹0
            </div>
            {profile?.role == 'admin' && (
              <div
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  goToAdminDashboard();
                }}
                className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium block cursor-pointer"
              >
                Admin Dashboard
              </div>
            )}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="text-left text-red-600 hover:text-red-900 font-semibold hover:bg-red-50 px-3 py-2 rounded-md w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
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
                  className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
