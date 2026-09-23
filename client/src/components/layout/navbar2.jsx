"use client";
import React from 'react';
import Link from 'next/link';
import { logoutUser } from "@/utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

//import Search from "@/components/shared/search";
export default function Navbar2() {
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

  return (
    <nav className="bg-white w-full border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-[52px]">

        <div className="flex items-center gap-2">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10" 
              alt="Linkedlogo" 
              className="w-[34px] h-[34px] rounded cursor-pointer"
            />
 
          {/*<Search />*/}
        </div>
        <div className="flex items-center h-full gap-2 md:gap-4 lg:gap-6">
           <Link
  href="/feeds"
  className="flex flex-col items-center justify-center text-gray-500cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
>
  <span className="text-xs mt-1">Home</span>
</Link>

<Link
  href="/mynetwork"
  className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
>
  <span className="text-xs mt-1">My network</span>
</Link>

<Link
  href="/messages"
  className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
>
  <span className="text-xs mt-1">Message</span>
</Link>

<Link
  href="/notification"
  className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
>
  <span className="text-xs mt-1">Notification</span>
</Link>

<Link
  href="/profile/abc123"
  className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
>
  <span className="text-xs mt-1">Me</span>
</Link>

<button
  onClick={handleLogout}
  className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer h-full min-w-[60px] md:min-w-[80px] hover:border-b-2 hover:border-black"
>
  <span className="text-xs mt-1">Logout</span>
</button>
        </div>

      </div>
    </nav>
  );
}
