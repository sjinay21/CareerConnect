"use client";

import { useAppNavigation } from "@/hooks/useNavigation";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function NotFound() {
  const { goToFeeds, goToHome } = useAppNavigation();

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col">
      <header className="bg-white w-full h-[52px] flex items-center px-4 lg:px-24 border-b border-gray-200">
        <button onClick={goToHome} className="flex items-center">
          <h3 className="text-blue-600 font-bold text-xl md:text-3xl hidden sm:block">
            Linked
          </h3>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10"
            alt="Linkedlogo"
            className="w-[34px] h-[34px] rounded cursor-pointer mx-2"
          />
        </button>
      </header>

      <main className="w-full flex flex-cols items-center justify-center p-4">
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
