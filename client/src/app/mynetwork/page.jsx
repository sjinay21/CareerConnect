"use client";
import PrivateRoute from "@/Route/privateroute";
import { useState, useEffect } from "react";
import Profile from "@/components/profile/profile";
import Buttonvariants from "@/components/ui/button";
import Search from "@/components/shared/search";
import {
  getAllUsers,
  getConnections,
  sendConnectionRequest,
  createOrGetConversation,
  updateConnectionStatus,
} from "@/utils/api";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";

function MyNetwork() {
  const { profile } = useProfile();
  const router = useRouter();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState({
    received: [],
    sent: [],
    friends: [],
  });
  const [offset, setOffset] = useState(0);
  const [text, settext] = useState("Catchup your friend");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, connRes] = await Promise.all([
          getAllUsers(),
          getConnections(),
        ]);
        if (usersRes.ok) {
          const data = await usersRes.json();
          setAllUsers(data.users || []);
        }
        if (connRes.ok) {
          const cData = await connRes.json();
          setConnections(cData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleFollow = async (user) => {
    try {
      const response = await sendConnectionRequest(user.id);
      if (response.ok) {
        const connRes = await getConnections();
        if (connRes.ok) {
          const cData = await connRes.json();
          setConnections(cData);
        }
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleMessage = async (userId) => {
    try {
      const response = await createOrGetConversation(userId);
      if (response.ok) {
        router.push("/messages");
      }
    } catch (error) {
      console.error("Error creating/getting conversation", error);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      const response = await updateConnectionStatus(connectionId, "accepted");
      if (response.ok) {
        const connRes = await getConnections();
        if (connRes.ok) {
          const cData = await connRes.json();
          setConnections(cData);
        }
      }
    } catch (error) {
      console.error("Error accepting connection:", error);
    }
  };

  const getConnectionStatus = (userId) => {
    if (connections.friends.some((c) => c.user.id == userId))
      return "connected";
    const sentReq = connections.sent.find((c) => c.user.id == userId);
    if (sentReq)
      return sentReq.status == "expired" || sentReq.status == "rejected"
        ? sentReq.status
        : "pending";
    if (connections.received.some((c) => c.user.id == userId)) return "pending";
    return "none";
  };

  const getConnectionCooldown = (userId) => {
    const sentReq = connections.sent.find((c) => c.user.id == userId);
    if (sentReq) return sentReq.cooldown_until || sentReq.cooldownUntil;
    return null;
  };

  async function handlefriend() {
    settext("Catchup your friend");
  }
  async function pendingrequest() {
    settext("Pending Request");
  }
  async function users() {
    settext("Users");
  }
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-9 flex flex-col gap-5 w-full">
        {/* Search and Navigation Bar */}
        <div className="py-4 px-4 sm:px-10 border border-gray-300 w-full flex flex-col md:flex-row gap-4 justify-between items-center my-5 text-xl bg-white rounded-xl shadow-sm">
          <div className="w-full md:w-1/3">
            <Search
              showDropdown={false}
              limit={10}
              offset={offset}
              onResults={(response) => setSearchedUsers(response.data)}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
            <Buttonvariants
              variant={text == "Catchup your friend" ? "active" : "outline"}
              onClick={handlefriend}
            >
              Friends
            </Buttonvariants>

            <Buttonvariants
              variant={text == "Pending Request" ? "active" : "outline"}
              onClick={pendingrequest}
            >
              Pending Request
            </Buttonvariants>
            <Buttonvariants
              variant={text == "Users" ? "active" : "outline"}
              onClick={users}
            >
              Users
            </Buttonvariants>
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="flex w-full gap-5 flex-wrap items-start justify-center">
          {(() => {
            let usersToDisplay = [];
            if (text == "Users") {
              usersToDisplay = (
                searchedUsers.length > 0 ? searchedUsers : allUsers
              ).filter((u) => u.id != profile?.id);
              return usersToDisplay.length > 0 ? (
                usersToDisplay.map((user) => (
                  <div
                    key={user.id}
                    className="w-full sm:w-[47%] md:w-[31%] lg:w-[23%] min-w-[200px]"
                  >
                    <Profile
                      user={user}
                      showFollowButton={true}
                      connectionStatus={getConnectionStatus(user.id)}
                      cooldownUntil={getConnectionCooldown(user.id)}
                      onFollow={() => handleFollow(user)}
                      onMessage={() => handleMessage(user.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-gray-500 mt-10">No users found.</div>
              );
            } else if (text == "Pending Request") {
              const pendingItems = [
                ...connections.sent
                  .map((c) => ({
                    user: c.user,
                    type: "sent",
                    connectionId: c.connectionId,
                    status: c.status,
                    cooldownUntil: c.cooldown_until || c.cooldownUntil,
                  }))
                  .filter(
                    (item) =>
                      item.status == "pending" ||
                      (item.cooldownUntil &&
                        new Date(item.cooldownUntil) > new Date()),
                  ),
                ...connections.received.map((c) => ({
                  user: c.user,
                  type: "received",
                  connectionId: c.connectionId,
                  status: c.status,
                })),
              ];
              return pendingItems.length > 0 ? (
                pendingItems.map((item) => (
                  <div
                    key={item.user.id}
                    className="w-full sm:w-[47%] md:w-[31%] lg:w-[23%] min-w-[200px]"
                  >
                    <Profile
                      user={item.user}
                      showFollowButton={true}
                      connectionStatus={
                        item.type == "received"
                          ? "received"
                          : item.status === "expired" ||
                              item.status === "rejected"
                            ? item.status
                            : "pending"
                      }
                      cooldownUntil={item.cooldownUntil}
                      onMessage={() => handleMessage(item.user.id)}
                      onAccept={() => handleAccept(item.connectionId)}
                      onFollow={() => handleFollow(item.user)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-gray-500 mt-10">No pending requests.</div>
              );
            } else if (text == "Catchup your friend") {
              usersToDisplay = connections.friends.map((c) => c.user);
              return usersToDisplay.length > 0 ? (
                usersToDisplay.map((user) => (
                  <div
                    key={user.id}
                    className="w-full sm:w-[47%] md:w-[31%] lg:w-[23%] min-w-[200px]"
                  >
                    <Profile
                      user={user}
                      showFollowButton={true}
                      connectionStatus="connected"
                      onMessage={() => handleMessage(user.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-gray-500 mt-10">No friends found.</div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
}

export default function WrappedMyNetwork() {
  return (
    <PrivateRoute>
      <MyNetwork />
    </PrivateRoute>
  );
}
