"use client";
import { useState, useEffect } from "react";
import { searchUsers } from "@/utils/api";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Input from "@/components/ui/input";
export default function Search({ onResults, showDropdown = true, limit = 5, offset = 0 }) {
  const [searchInput, setSearchInput] = useState("");
  const [timer, setTimer] = useState(null);
  const [users, setUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // If pagination offset changes (e.g. clicking "Next Page" in MyNetwork), trigger a re-fetch
  useEffect(() => {
    if (searchInput) {
      updateSearch(searchInput, limit, offset);
    }
  }, [offset, limit]);

  function debounce(func, delay, value) {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      func(value, limit, offset);
    }, delay);
    setTimer(newTimer);
  }

  async function updateSearch(value, currentLimit, currentOffset) {
    if (!value.trim()) {
      setUsers([]);
      if (onResults) onResults({ data: [], pagination: null });
      return;
    }
    
    try {
      const response = await searchUsers(value, currentLimit, currentOffset);
      const data = await response.json();
      setUsers(data.data || []);
      
      // Pass the data up to the parent component (used by MyNetwork)
      if (onResults) {
        onResults(data);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  }

  function handleSearch(value) {
    setSearchInput(value);
    setIsDropdownOpen(true);
    debounce(updateSearch, 500, value);
  }

  return (
    <div className="relative">
       <div className="absolute inset-y-0 left-3 flex items-center text-black">
        <SearchTwoToneIcon />
      </div>
      <Input
        type="search"
        variant="search"
        placeholder="Search users..."
        value={searchInput}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
      />

      {showDropdown && isDropdownOpen && users.length > 0 && (
        <div className="absolute top-11 left-0 w-80 bg-white border border-gray-200 rounded-md shadow-md z-50 max-h-80 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="px-4 py-3 border-b border-white-100 hover:bg-gray-100 cursor-pointer flex flex-col"
              onClick={() => {  
                setSearchInput(user.name);
                setIsDropdownOpen(false);
              }}
            >
              <span className="font-semibold text-gray-800">{user.name}</span>
              {user.summary && <span className="text-sm text-gray-500">{user.summary}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 
// YOUTUBE SEARCH 
"use client";
import { useState } from "react";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [timer, setTimer] = useState(null);
  const [videos, setVideos] = useState([]);

  function debounce(func, delay, value) {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      func(value);
    }, delay);
    setTimer(newTimer);
  }
  async function updateSearch(value) {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(value)}&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    setVideos(data.items);
  }
  function handleSearch(value) {
    setSearchInput(value);
    debounce(updateSearch, 850, value);
  }
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search"
        value={searchInput}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-gray-100 rounded-sm w-55 h-10 px-4"
      />
      {videos.length > 0 && (
        <div className="absolute top-11 left-0 w-80 bg-white border border-gray-200 rounded-md shadow-md z-50">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              className="px-4 py-3 border-b border-gray-100 hover:bg-gray-100 cursor-pointer"
            >
              {video.snippet.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/