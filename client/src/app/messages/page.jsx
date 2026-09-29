/*
// OLD IMPLEMENTATION - kept for reference
// Replaced to use actual API for conversations
"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState } from "react";
import Card from "@/components/shared/card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Conversation from "@/components/messaging/conversation";
import Chat from "@/components/messaging/chat";
import { users } from "../../data/user";
import Advertisement from "@/components/feed/advertisement";

function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  return (
    <div className="w-full flex justify-between px-3 xl:px-5 py-9 gap-5 bg-gray-100 pt-5 h-[100vh]">
      <div className="w-full md:w-[70%]">
        <Card padding={0}>
          <div className="border border-gray-300 py-2 px-5 font-semibold text-lg">
            Messaging
          </div>
          <div className="border border-gray-300 py-2 px-5 ">
            <div className="py-1 px-3 hover:bg-green-900 bg-green-800 flex gap-2 w-fit rounded-2xl font-semibold text-white">
              Focused
              <ArrowDropDownIcon />
            </div>
          </div>
          <div className="w-full md:flex">
            <div className="h-[590px] overflow-auto w-full md:w-[40%] border-r border-gray-400">
              {users.map((user) => (
                <Conversation
                  key={user.id}
                  user={user}
                  onClick={() => setSelectedUser(user)}
                />
              ))}
            </div>
            <div className="w-full md:w-[60%]">
              {selectedUser ? (
                <Chat user={selectedUser} chat={chats} setChats={setChats} />
              ) : (
                <div className="flex items-center justify-center h-[590px]">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div className="hidden md:flex md:w-[28%]">
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
}


export default function WrappedMessages() {
  return <PrivateRoute><Messages /></PrivateRoute>;
}
*/

"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState, useEffect } from "react";
import Card from "@/components/shared/card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Conversation from "@/components/messaging/conversation";
import Chat from "@/components/messaging/chat";
import Advertisement from "@/components/feed/advertisement";
import { getUserConversationsList } from "@/utils/api";
import { io } from "socket.io-client";
function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Fetch Conversations
    async function fetchConversations() {
      try {
        const response = await getUserConversationsList();
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
        } else {
          setError("Failed to fetch conversations");
        }
      } catch (err) {
        setError("Error fetching conversations");
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();

    // 2. Setup Socket.IO Connection
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"]
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSelectConversation = (conversationId, user) => {
    setSelectedConversationId(conversationId);
    setSelectedUser(user);

    if (socket) {
      socket.emit("join_conversation", { conversationId }, (response) => {
        console.log("Join conversation response:", response);
      });
    }
  };

  return (
    <div className="w-full flex justify-between px-3 xl:px-5 py-9 gap-5 bg-gray-100 pt-5 h-[100vh]">
      <div className="w-full md:w-[70%]">
        <Card padding={0}>
          <div className="border border-gray-300 py-2 px-5 font-semibold text-lg">
            Messaging
          </div>
          <div className="border border-gray-300 py-2 px-5 ">
            <div className="py-1 px-3 hover:bg-green-900 bg-green-800 flex gap-2 w-fit rounded-2xl font-semibold text-white">
              Focused
              <ArrowDropDownIcon />
            </div>
          </div>
          <div className="w-full md:flex h-[590px] rounded-b-md overflow-hidden">
            <div className="h-full overflow-auto w-full md:w-[40%] border-r border-gray-300">
              {loading && <div className="p-5 text-center">Loading conversations...</div>}
              {error && <div className="p-5 text-center text-red-500">{error}</div>}
              {!loading && !error && conversations.length === 0 && (
                <div className="p-5 text-center text-gray-500">No conversations yet.</div>
              )}
              {!loading && !error && conversations.map((conv) => (
                <Conversation
                  key={conv.conversationId}
                  user={conv.user}
                  onClick={() => handleSelectConversation(conv.conversationId, conv.user)}
                />
              ))}
            </div>
            <div className="w-full md:w-[60%] h-full">
              {selectedUser ? (
                <Chat user={selectedUser} chat={[]} setChats={() => {}} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div className="hidden md:flex md:w-[28%]">
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
}

export default function WrappedMessages() {
  return <PrivateRoute><Messages /></PrivateRoute>;
}
