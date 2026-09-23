"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState } from "react";
import { useAppNavigation } from "@/hooks/useNavigation";
import Textarea from "@/components/ui/textarea";

function Article() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { goToFeeds } = useAppNavigation();
  function handlePost() {
    if (!title.trim()) {
  return;
}
     if (!content.trim()) {
      return;
    }
    const newArticle = {
      id: Date.now(),
      type: "article",
      title: title,
      content: content,
    };
    const oldPosts = JSON.parse(sessionStorage.getItem("posts")) || [];
    const updatedPosts = [newArticle, ...oldPosts];
    sessionStorage.setItem("posts",JSON.stringify(updatedPosts)
    );
    goToFeeds();
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full border-b px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-gray-700">
          Write an article
        </div>
        <button
          onClick={handlePost}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-full"
        >
          Post
        </button>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-semibold text-gray-800 placeholder-gray-400 outline-none mb-8"
        />
        <Textarea
          placeholder="Write your article..."
          value={content}
          rows="10"
          cols="120"
          onChange={(e) => setContent(e.target.value)}
         variants="primary"
        />
      </div>
    </div>
  );
}

export default function WrappedArticle() {
  return <PrivateRoute><Article /></PrivateRoute>;
}
