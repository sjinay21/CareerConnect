/*"use client";
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
}*/