"use client";

import { useAppNavigation } from "@/hooks/useNavigation";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/api";
import Navbar1 from "@/components/layout/navbar1";
import Navbar2 from "@/components/layout/navbar2";

export default function NotFound() {
  const { goToFeeds } = useAppNavigation();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col">
      {isLogin ? <Navbar2 /> : <Navbar1 />}

      <main className="w-full flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-[400px] w-full bg-white p-8 rounded-lg shadow-sm border border-gray-300">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
            <SearchOffIcon className="text-gray-400" sx={{ fontSize: 40 }} />
          </div>

          <h2 className="text-[20px] font-semibold text-black mb-2">
            This page doesn't exist
          </h2>

          <p className="text-gray-600 mb-2 pb-2 text-[14px]">
            Please check your URL or return to LinkedIn home.
          </p>

          <button
            onClick={goToFeeds}
            className="border border-[#0a66c2] text-[#0a66c2] font-semibold py-1.5 px-6 rounded-full hover:bg-blue-50 hover:border-2 transition-all inline-block text-[15px]"
          >
            Go to your feed
          </button>
        </div>
      </main>
    </div>
  );
}
