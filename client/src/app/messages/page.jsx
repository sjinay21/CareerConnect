
"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState, useEffect } from "react";
import Card from "@/components/shared/card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Conversation from "@/components/messaging/conversation";
import Chat from "@/components/messaging/chat";
import Advertisement from "@/components/feed/advertisement";
import { getUserConversationsList, getConversationMessages, getUserProfile } from "@/utils/api";
import { PAGINATION_LIMITS } from "@/utils/paginationConfig";
import { io } from "socket.io-client";
function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const [conversationLimit, setConversationLimit] = useState(PAGINATION_LIMITS.CONVERSATIONS);
  const [conversationOffset, setConversationOffset] = useState(0);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const [messageLimit, setMessageLimit] = useState(PAGINATION_LIMITS.MESSAGES);
  const [messageOffset, setMessageOffset] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  async function fetchConversations(limit, offset) {
    if (loadingConversations) return;
    try {
      setLoadingConversations(true);
      const response = await getUserConversationsList(limit, offset);
      if (response.ok) {
        const result = await response.json();
        setConversations(prev => {
          // Remove duplicates to prevent React key errors
          const prevIds = new Set(prev.map(c => c.conversationId));
          const uniqueNew = (result.data || []).filter(c => !prevIds.has(c.conversationId));
          // If it's the very first request (offset 0), don't append to previous
          if (offset == 0) return result.data || [];
          return [...prev, ...uniqueNew];
        });
        setHasMoreConversations(result.pagination?.hasNextPage ?? false);
      } else {
        setError("Failed to fetch conversations");
      }
    } catch (err) {
      setError("Error fetching conversations");
    } finally {
      setLoadingConversations(false);
    }
  }

  const loadMoreConversations = () => {
    if (hasMoreConversations && !loadingConversations) {
      const newOffset = conversationOffset + conversationLimit;
      setConversationOffset(newOffset);
      fetchConversations(conversationLimit, newOffset);
    }
  };

  const handleConversationsScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Simple bottom detection (allow a small 5px buffer for sub-pixel accuracy)
    if (scrollHeight - scrollTop - clientHeight < 5) {
      loadMoreConversations();
    }
  };

  /* 
   * OLD CODE (Replaced to fix race condition where auto-fill and initial fetch run concurrently):
   * useEffect(() => {
   *   const container = document.getElementById("conversations-container");
   *   if (container && hasMoreConversations && !loadingConversations) {
   *     if (container.scrollHeight <= container.clientHeight) {
   *       loadMoreConversations();
   *     }
   *   }
   * }, [conversations, hasMoreConversations, loadingConversations]);
   */
  // 3. MINIMUM REQUIRED FIX: Auto-fill sequentially ONLY AFTER initial load finishes
  useEffect(() => {
    // Only attempt auto-fill if conversations have loaded (length > 0)
    // This ensures offset=0 completely finishes before any auto-fill begins.
    if (conversations.length > 0 && hasMoreConversations && !loadingConversations && !error) {
      const container = document.getElementById("conversations-container");
      // If the content is smaller than the container, no scrollbar exists!
      if (container && container.scrollHeight <= container.clientHeight) {
        loadMoreConversations();
      }
    }
  }, [conversations, hasMoreConversations, loadingConversations, error]);

  useEffect(() => {
    // 1. Fetch Initial Conversations
    fetchConversations(conversationLimit, 0);

    // Fetch the actual current user profile to get their ID
    async function fetchCurrentUser() {
      try {
        const response = await getUserProfile();
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.id || data.user?.id);
        }
      } catch (e) {
        console.error("Error fetching current user", e);
      }
    }
    fetchCurrentUser();

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
  // 3. Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (newMessage.conversation_id == selectedConversationId) {
        setMessages((prev) => {
          if (prev.some(m => m.id == newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        // Let the backend know we saw this message since we're currently looking at the conversation
        socket.emit("mark_as_seen", { conversationId: selectedConversationId });
      }
    };

    const handleMessagesSeen = (data) => {
      if (data.conversationId == selectedConversationId) {
        setMessages((prev) => 
          prev.map((msg) => ({ ...msg, is_seen: true }))
        );
      }
    };

    const handleRemoteTyping = (data) => {
      if (data.conversationId == selectedConversationId) {
        setIsTyping(true);
      }
    };

    const handleRemoteStopTyping = (data) => {
      if (data.conversationId == selectedConversationId) {
        setIsTyping(false);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("typing", handleRemoteTyping);
    socket.on("stop_typing", handleRemoteStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("messages_seen", handleMessagesSeen);
      socket.off("typing", handleRemoteTyping);
      socket.off("stop_typing", handleRemoteStopTyping);
    };
  }, [socket, selectedConversationId]);

  const handleSelectConversation = async (conversationId, user) => {
    setSelectedConversationId(conversationId);
    setSelectedUser(user);
    setMessages([]);
    setIsTyping(false);

    setMessageOffset(0);
    setHasMoreMessages(true);

    try {
      const response = await getConversationMessages(conversationId, messageLimit, 0);
      if (response.ok) {
        const result = await response.json();
        const initialMessages = (result.data || []).reverse();
        setMessages(initialMessages);
        setHasMoreMessages(result.pagination?.hasNextPage ?? false);
      }
    } catch (err) {
      console.error("Error fetching messages", err);
    }
    
    if (socket) {
      socket.emit("join_conversation", { conversationId }, (response) => {
        console.log("Join conversation response:", response);
        if (!response.success) {
          console.log(response.message);
        }
      });
    }
  };

  const loadMoreMessages = async () => {
    if (hasMoreMessages && selectedConversationId && !loadingMessages) {
      const newOffset = messageOffset + messageLimit;
      setMessageOffset(newOffset);
      try {
        setLoadingMessages(true);
        const response = await getConversationMessages(selectedConversationId, messageLimit, newOffset);
        if (response.ok) {
          const result = await response.json();
          const olderMessages = (result.data || []).reverse();
          setMessages(prev => {
            // Remove duplicates to prevent React key errors
            const prevIds = new Set(prev.map(m => m.id));
            const uniqueOlder = olderMessages.filter(m => !prevIds.has(m.id));
            return [...uniqueOlder, ...prev];
          });
          setHasMoreMessages(result.pagination?.hasNextPage ?? false);
        }
      } catch (err) {
        console.error("Error fetching more messages", err);
      } finally {
        setLoadingMessages(false);
      }
    }
  };

  const handleSendMessage = (content) => {
    if (!socket || !selectedConversationId) return;

    socket.emit("send_message", {
      conversationId: selectedConversationId,
      content
    });
  };

  const handleTyping = () => {
    if (socket && selectedConversationId) {
      socket.emit("typing", { conversationId: selectedConversationId });
    }
  };

  const handleStopTyping = () => {
    if (socket && selectedConversationId) {
      socket.emit("stop_typing", { conversationId: selectedConversationId });
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
            <div 
              id="conversations-container"
              className="h-full overflow-auto w-full md:w-[40%] border-r border-gray-300"
              onScroll={handleConversationsScroll}
            >
              {error && <div className="p-5 text-center text-red-500">{error}</div>}
              {!error && conversations.length === 0 && (
                <div className="p-5 text-center text-gray-500">No conversations yet.</div>
              )}
              {!error && conversations.map((conv) => (
                <Conversation
                  key={conv.conversationId}
                  user={conv.user}
                  isSelected={selectedConversationId == conv.conversationId}
                  onClick={() => handleSelectConversation(conv.conversationId, conv.user)}
                />
              ))}
              {loadingConversations && <div className="p-3 text-center text-gray-500 text-sm">Loading...</div>}
            </div>
            <div className="w-full md:w-[60%] h-full">
              {selectedUser ? (
                <Chat
                  user={selectedUser}
                  chat={messages}
                  onSendMessage={handleSendMessage}
                  currentUserId={currentUserId}
                  isTyping={isTyping}
                  onTyping={handleTyping}
                  onStopTyping={handleStopTyping}
                  onLoadMoreMessages={loadMoreMessages}
                  hasMoreMessages={hasMoreMessages}
                  loadingMessages={loadingMessages}
                />
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
