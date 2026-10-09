"use client";
import PrivateRoute from "@/Route/privateroute";
import { useState } from "react";
import { useAppNavigation } from "@/hooks/useNavigation";
import Textarea from "@/components/ui/textarea";
import { createPost } from "@/utils/api";

function Article() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { goToFeeds } = useAppNavigation();

  async function handlePost() {
    if (!title.trim()) {
      return;
    }
    if (!content.trim()) {
      return;
    }

    // Combine title and content as markdown or formatted string
    const fullContent = `**${title}**\n\n${content}`;

    const formData = new FormData();
    formData.append("content", fullContent);

    try {
      const res = await createPost(formData);
      if (res.ok) {
        goToFeeds();
      } else {
        console.error("Failed to post article");
      }
    } catch (err) {
      console.error(err);
    }
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
  return (
    <PrivateRoute>
      <Article />
    </PrivateRoute>
  );
}
