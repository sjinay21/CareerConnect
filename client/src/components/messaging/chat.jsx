"use client";

import { useState, useEffect } from "react";
import { List } from "react-window";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function Chat({ user, chat, onSendMessage, currentUserId, isTyping, onTyping, onStopTyping, onLoadMoreMessages, hasMoreMessages, loadingMessages }) {
  const [message, setMessage] = useState("");

  const lastMessage = chat.length > 0 ? chat[chat.length - 1] : null;
  /*useEffect(() => {
  console.log("Chat state:", chat);
  console.log("Chat message count:", chat.length);
}, [chat]);*/
  useEffect(() => {
    const container = document.querySelector(".react-window-list");
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [lastMessage]);

  const handleScroll = async (e) => {
    if (e.target.scrollTop == 0 && hasMoreMessages && !loadingMessages) {
      const container = e.target;
      const previousScrollHeight = container.scrollHeight;
      
      await onLoadMoreMessages();
      
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

  // Beginner-friendly variable height estimation
  const getRowHeight = (index) => {
    if (index == chat.length) return 40; // Height for the typing indicator
    const msg = chat[index];
    if (!msg) return 60;
    const charCount = msg.content?.length || 0;
    // Base height increased from 60 to 76 to accommodate the timestamp
    return 76 + Math.floor(charCount / 50) * 24;
  };

  const RowComponent = ({ index, style }) => {
    // If it's the very last index (beyond the chat array), render the typing indicator
    if (index == chat.length) {
      return (
        <div style={style}>
          <div className="flex mb-3 justify-start">
            <p className="text-gray-500 italic text-sm px-4 py-2">
              {user?.name || "User"} is typing...
            </p>
          </div>
        </div>
      );
    }

    const msg = chat[index];
    const isSender = msg.sender_id == currentUserId;

    return (
      <div style={style}>
        <div className={`flex flex-col mb-3 px-4 ${isSender ? "items-end" : "items-start"}`}>
          <div className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}>
            <p className={`text-white px-4 py-2 rounded-2xl max-w-[70%] ${isSender ? "bg-green-700" : "bg-blue-600"}`}>
              {msg.content}
            </p>
            {isSender && (
              <div className="flex items-end ml-1 mb-1">
                <DoneAllIcon sx={{ fontSize: 20 }} className={msg.is_seen ? "text-blue-500" : "text-gray-400"} />
              </div>
            )}
          </div>
          {msg.created_at && (
            <span className={`text-[10px] text-gray-500 mt-1 ${isSender ? "mr-7" : "ml-2"}`}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    );
  };

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

      {/* 
       * OLD CODE (Replaced because react-window now handles rendering only visible messages):
       * <div id="messages-container" className="flex-1 p-4 overflow-y-auto" onScroll={handleScroll}>
       *   {loadingMessages && <div className="text-center text-gray-500 text-xs my-2">Loading older messages...</div>}
       *   {chat.map(...)}
       *   {isTyping && ...}
       * </div>
       */}
     <div className="flex-1 min-h-0 relative">
        {loadingMessages && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded shadow text-xs text-gray-500 z-10">
            Loading older messages...
          </div>
        )}
        <List
          className="react-window-list"
          style={{ height: "100%", width: "100%" }}
          rowCount={chat.length + (isTyping ? true : false)}
          rowHeight={getRowHeight}
          rowComponent={RowComponent}
          onScroll={handleScroll}
        />
      </div>

      <div className="p-4 border-t border-gray-300">
        <form 
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Write a message..."
            variant="secondary"
          />

          <Buttonvariants variant="chatsend" type="submit">
            Send
          </Buttonvariants>
        </form>
      </div>
    </div>
  );
}
