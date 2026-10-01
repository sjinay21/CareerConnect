/*
// OLD IMPLEMENTATION - kept for reference
// Replaced to use user.summary instead of user.position for real backend data
"use client";
import { useState } from "react";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
export default function Chat({ user, chat, setChats }) {
  const [message, setMessage] = useState("");
  const [side, setSide] = useState("left");

  function value() {
    if (message === "") {
      return;
    }
    const newchat = {
      userId: user.id,
      text: message,
      side: side,
    };
    setChats([...chat, newchat]);
    setMessage("");
  }
  const userChats = chat.filter((msg) => msg.userId === user.id);
  return (
    <div className="w-full h-[590px] flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <div className="shrink-0">
          <img
            src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
            alt="image"
            className="rounded-full h-12 w-12 cursor-pointer"
          />
        </div>

        <div>
          <div className="text-md">{user.name}</div>
          <div className="text-sm text-gray-500">{user.position}</div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {userChats.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${
              msg.side === "left" ? "justify-start" : "justify-end"
            }`}
          >
            <p
              className={`text-white px-4 py-2 rounded-2xl max-w-[70%] ${
                msg.side === "left" ? "bg-blue-600" : "bg-green-700"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-300">
        <div className="flex gap-2 mb-3">
          <Buttonvariants
            variant={side === "left" ? "leftActive" : "inactive"}
            onClick={() => setSide("left")}
          >
            Left
          </Buttonvariants>

          <Buttonvariants
            variant={side === "right" ? "rightActive" : "inactive"}
            onClick={() => setSide("right")}
          >
            Right
          </Buttonvariants>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
           variant="secondary"
          />

          <Buttonvariants variant="chatsend" onClick={value}>
            Send
          </Buttonvariants>
        </div>
      </div>
    </div>
  );
}


"use client";
import { useState, useEffect } from "react";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
let typingTimeout = null;
export default function Chat({ user, chat, onSendMessage, currentUserId, isTyping, onTyping, onStopTyping }) {
  const [message, setMessage] = useState("");
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, []);
  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // 1. Tell the server we are typing
    if (onTyping) {
      onTyping();
    }

    // 2. Clear any old timer (if it exists)
    clearTimeout(typingTimeout);

    // 3. Start a new timer for 1.5 seconds
    typingTimeout = setTimeout(() => {
      if (onStopTyping) {
        onStopTyping();
      }
    }, 1500);
  };

  function handleSend() {
    if (message.trim() == "") {
      return;
    }
    
    // Clear typing timeout and emit stop_typing immediately
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    if (onStopTyping) onStopTyping();

    onSendMessage(message);
    setMessage("");
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-300 flex items-center gap-3">
        <div className="shrink-0">
          <img
            src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
            alt="image"
            className="rounded-full h-12 w-12 cursor-pointer"
          />
        </div>

        <div>
          <div className="text-md font-semibold">{user?.name}</div>
          <div className="text-sm text-gray-500">
            {user?.summary || user?.position || "LinkedIn Member"}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {chat.map((msg, index) => {
          // If msg.sender_id matches currentUserId, it's our message (right side)
          // Note: In Postgres, sender_id might come as string or number, so use ==
          const isSender = msg.sender_id == currentUserId;

          return (
            <div
              key={msg.id || index}
              className={`flex mb-3 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <p
                className={`text-white px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                  isSender ? "bg-green-700" : "bg-blue-600"
                }`}
              >
                {msg.content}
              </p>
            </div>
          );
        })}
        
        {/* Typing Indicator at bottom left of chat *
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
            onKeyDown={(e) => e.key == 'Enter' && handleSend()}
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
}*/
"use client";

import { useState } from "react";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function Chat({ user, chat, onSendMessage, currentUserId, isTyping, onTyping, onStopTyping }) {
  const [message, setMessage] = useState("");

  let typingTimeout = null;
  const handleChange = (e) => {
    setMessage(e.target.value);
    // Tell the server we are typing
    if (onTyping) {
      onTyping();
    }
    // Clear the old timer
    //clearTimeout(typingTimeout);
    // Start a new timer
    /*typingTimeout = setTimeout(() => {
      if (onStopTyping) {
        onStopTyping();
      }
    }, 1500);*/
  };
  function handleSend() {
    if (message.trim() == "") {
      return;
    }
    // Stop typing immediately when the message is sent
    clearTimeout(typingTimeout);
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
            className="rounded-full h-12 w-12 cursor-pointer object-cover bg-white"
          />
        </div>

        <div>
          <div className="text-md font-semibold">{user?.name}</div>
          <div className="text-sm text-gray-500">
            {user?.summary || user?.position || "LinkedIn Member"}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {chat.map((msg, index) => {
          const isSender = msg.sender_id == currentUserId;

          return (
            <div
              key={msg.id || index}
              className={`flex mb-3 ${isSender ? "justify-end" : "justify-start"
                }`}
            >
              <p
                className={`text-white px-4 py-2 rounded-2xl max-w-[70%] break-words ${isSender ? "bg-green-700" : "bg-blue-600"
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
