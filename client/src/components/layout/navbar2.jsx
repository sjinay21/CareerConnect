"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { logoutUser } from "@/utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import Search from "@/components/shared/search";

export default function Navbar2() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    }
  };

  const navLinks = [
    { href: "/feeds", label: "Home" },
    { href: "/mynetwork", label: "My network" },
    { href: "/messages", label: "Message" },
    { href: "/notification", label: "Notification" },
    { href: "/profile/abc123", label: "Me" },
  ];

  return (
    <nav className="bg-white w-full border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-[52px]">

        <div className="flex items-center flex-1 md:flex-none">
          <h3 className="text-blue-600 font-bold text-xl md:text-3xl hidden sm:block">
            Linked
          </h3>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10" 
            alt="Linkedlogo" 
            className="w-[34px] h-[34px] rounded cursor-pointer mx-2 sm:mx-0"
          />
 
          <div className="ml-2 md:ml-4 flex-1 max-w-[200px] md:max-w-none">
            <Search limit={5} />
          </div>
        </div>
        <div className="hidden md:flex items-center h-full gap-2 md:gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
            >
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
          >
            <span className="text-xs mt-1">Logout</span>
          </button>
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
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="text-left text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md font-medium w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
