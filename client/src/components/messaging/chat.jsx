"use client";

import { useState, useEffect } from "react";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function Chat({ user, chat, onSendMessage, currentUserId, isTyping, onTyping, onStopTyping, onLoadMoreMessages, hasMoreMessages, loadingMessages }) {
  const [message, setMessage] = useState("");

  const handleScroll = async (e) => {
    if (e.target.scrollTop == 0 && hasMoreMessages && !loadingMessages) {
      const container = e.target;
      const previousScrollHeight = container.scrollHeight;
      
      await onLoadMoreMessages();
      
      // Let React update the DOM, then restore the exact scroll position
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        }
      }, 10);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };

  function handleSend() {
    if (message.trim() == "") {
      return;
    }
    
    if (onStopTyping) {
      onStopTyping();
    }
    
    onSendMessage(message);
    setMessage("");
  }
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-300 flex items-center gap-3">
        <div className="shrink-0">
          <img
            src={user?.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"}
            alt="image"
            className="rounded-full h-12 w-12 cursor-pointer  bg-white"
          />
        </div>

        <div>
          <div className="text-md font-semibold">{user?.name}</div>
          <div className="text-sm text-gray-500">
            {user?.summary || user?.position || "LinkedIn Member"}
          </div>
        </div>
      </div>

      <div 
        id="messages-container"
        className="flex-1 p-4 overflow-y-auto"
        onScroll={handleScroll}
      >
        {loadingMessages && <div className="text-center text-gray-500 text-xs my-2">Loading older messages...</div>}
        {chat.map((msg, index) => {
          const isSender = msg.sender_id == currentUserId;

          return (
            <div
              key={msg.id || index}
              className={`flex mb-3 ${isSender ? "justify-end" : "justify-start"
                }`}
            >
              <p
                className={`text-white px-4 py-2 rounded-2xl max-w-[70%] ${isSender ? "bg-green-700" : "bg-blue-600"
                  }`}
              >
                {msg.content}
              </p>
              {isSender && (
                <div className="flex items-end ml-1 mb-1">
                  <DoneAllIcon 
                    sx={{ fontSize: 20 }} 
                    className={msg.is_seen ? "text-blue-500" : "text-gray-400"} 
                  />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex mb-3 justify-start">
            <p className="text-gray-500 italic text-sm px-4 py-2">
              {user?.name || "User"} is typing...
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-300">
        <div className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={(e) => e.key == "Enter" && handleSend()}
            placeholder="Write a message..."
            variant="secondary"
          />

          <Buttonvariants variant="chatsend" onClick={handleSend}>
            Send
          </Buttonvariants>
        </div>
      </div>
    </div>
  );
}
