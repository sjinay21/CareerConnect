/*
// OLD IMPLEMENTATION - kept for reference
// Replaced to wire up Message button using createOrGetConversation API
"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState,useEffect } from "react";
import Profile from "@/components/profile/profile";
import Buttonvariants from "@/components/ui/button";
import Search from "@/components/shared/search";
import { getAllUsers, getConnections, sendConnectionRequest } from "@/utils/api";
import { useProfile } from "@/hooks/useProfile";

function MyNetwork() {
  const { profile } = useProfile();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState({ received: [], sent: [], friends: [] });
  const [offset, setOffset] = useState(0);
  const [text, settext] = useState("Catchup your friend");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, connRes] = await Promise.all([
          getAllUsers(),
          getConnections()
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
  const response = await sendConnectionRequest(user.id);

  if (response.ok) {
    const data = await response.json();

    const newSent = [...connections.sent];

    newSent.push({
      connectionId: data.connection.id,
      user: user
    });

    setConnections({
      ...connections,
      sent: newSent
    });
  }
};


  const getConnectionStatus = (userId) => {
    if (connections.friends.some(c => c.user.id == userId)) return 'connected';
    if (connections.sent.some(c => c.user.id == userId)) return 'pending';
    if (connections.received.some(c => c.user.id == userId)) return 'pending';
    return 'none';
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
    <div className="px-3 xl:px-5 py-9 flex gap-5 w-full mt-5 flex-col bg-gray-100">
      <div className="py-4 px-10 border border-gray-400 w-full flex justify-between item-center my-5 text-xl bg-white rounded-xl">
        <div className="w-1/3">
          <Search 
            showDropdown={false} 
            limit={10} 
            offset={offset} 
            onResults={(response) => setSearchedUsers(response.data)} 
          />
        </div>
        <div className="flex gap-3">
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

      <div className="flex h-[80xh] w-full gap-7 flex-wrap item-start justify-center">
        {(() => {
          const usersToDisplay = [];
          if (text == "Users") {
            usersToDisplay = (searchedUsers.length > 0 ? searchedUsers : allUsers).filter(u => u.id !=  profile?.id);
            return usersToDisplay.length > 0 ? usersToDisplay.map((user) => (
              <div key={user.id} className="md:w-[23%] h-270px sm:w-full">
                <Profile 
                  user={user} 
                  showFollowButton={true} 
                  connectionStatus={getConnectionStatus(user.id)}
                  onFollow={() => handleFollow(user.id)}
                />
              </div>
            )) : <div className="text-gray-500 mt-10">No users found.</div>;
          } else if (text == "Pending Request") {
            usersToDisplay = [...connections.sent.map(c => c.user), ...connections.received.map(c => c.user)];
            return usersToDisplay.length > 0 ? usersToDisplay.map((user) => (
              <div key={user.id} className="md:w-[23%] h-270px sm:w-full">
                <Profile user={user} showFollowButton={true} connectionStatus="pending" />
              </div>
            )) : <div className="text-gray-500 mt-10">No pending requests sent.</div>;
          } else if (text == "Catchup your friend") {
            usersToDisplay = connections.friends.map(c => c.user);
            return usersToDisplay.length > 0 ? usersToDisplay.map((user) => (
              <div key={user.id} className="md:w-[23%] h-270px sm:w-full">
                <Profile user={user} showFollowButton={true} connectionStatus="connected" />
              </div>
            )) : <div className="text-gray-500 mt-10">No friends found.</div>;
          }
        })()}
      </div>
    </div>
  );
}

export default function WrappedMyNetwork() {
  return <PrivateRoute><MyNetwork /></PrivateRoute>;
}
*/

"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState,useEffect } from "react";
import Profile from "@/components/profile/profile";
import Buttonvariants from "@/components/ui/button";
import Search from "@/components/shared/search";
import { getAllUsers, getConnections, sendConnectionRequest, createOrGetConversation, updateConnectionStatus } from "@/utils/api";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from 'next/navigation';

function MyNetwork() {
  const { profile } = useProfile();
  const router = useRouter();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState({ received: [], sent: [], friends: [] });
  const [offset, setOffset] = useState(0);
  const [text, settext] = useState("Catchup your friend");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, connRes] = await Promise.all([
          getAllUsers(),
          getConnections()
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
  const response = await sendConnectionRequest(user.id);

  if (response.ok) {
    const data = await response.json();

    const newSent = [...connections.sent];

    newSent.push({
      connectionId: data.connection.id,
      user: user
    });

    setConnections({
      ...connections,
      sent: newSent
    });
  }
};

  const handleMessage = async (userId) => {
    try {
      const response = await createOrGetConversation(userId);
      if (response.ok) {
        router.push('/messages');
      }
    } catch (error) {
      console.error("Error creating/getting conversation", error);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      const response = await updateConnectionStatus(connectionId, 'accepted');
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
    if (connections.friends.some(c => c.user.id == userId)) return 'connected';
    if (connections.sent.some(c => c.user.id == userId)) return 'pending';
    if (connections.received.some(c => c.user.id == userId)) return 'pending';
    return 'none';
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
    <div className="px-3 xl:px-5 py-9 flex gap-5 w-full mt-5 flex-col bg-gray-100">
      <div className="py-4 px-10 border border-gray-400 w-full flex justify-between item-center my-5 text-xl bg-white rounded-xl">
        <div className="w-1/3">
          <Search 
            showDropdown={false} 
            limit={10} 
            offset={offset} 
            onResults={(response) => setSearchedUsers(response.data)} 
          />
        </div>
        <div className="flex gap-3">
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

      <div className="flex h-[80xh] w-full gap-7 flex-wrap item-start justify-center">
        {(() => {
          let usersToDisplay = [];
          if (text == "Users") {
            usersToDisplay = (searchedUsers.length > 0 ? searchedUsers : allUsers).filter(u => u.id !=  profile?.id);
            return usersToDisplay.length > 0 ? usersToDisplay.map((user) => (
              <div key={user.id} className="md:w-[23%] h-270px sm:w-full">
                <Profile 
                  user={user} 
                  showFollowButton={true} 
                  connectionStatus={getConnectionStatus(user.id)}
                  onFollow={() => handleFollow(user)}
                  onMessage={() => handleMessage(user.id)}
                />
              </div>
            )) : <div className="text-gray-500 mt-10">No users found.</div>;
          } else if (text == "Pending Request") {
            const pendingItems = [
              ...connections.sent.map(c => ({ user: c.user, type: 'sent', connectionId: c.connectionId })), 
              ...connections.received.map(c => ({ user: c.user, type: 'received', connectionId: c.connectionId }))
            ];
            return pendingItems.length > 0 ? pendingItems.map((item) => (
              <div key={item.user.id} className="md:w-[23%] h-270px sm:w-full">
                <Profile 
                  user={item.user} 
                  showFollowButton={true} 
                  connectionStatus={item.type == 'received' ? 'received' : 'pending'} 
                  onMessage={() => handleMessage(item.user.id)}
                  onAccept={() => handleAccept(item.connectionId)}
                />
              </div>
            )) : <div className="text-gray-500 mt-10">No pending requests.</div>;
          } else if (text == "Catchup your friend") {
            usersToDisplay = connections.friends.map(c => c.user);
            return usersToDisplay.length > 0 ? usersToDisplay.map((user) => (
              <div key={user.id} className="md:w-[23%] h-270px sm:w-full">
                <Profile 
                  user={user} 
                  showFollowButton={true} 
                  connectionStatus="connected" 
                  onMessage={() => handleMessage(user.id)}
                />
              </div>
            )) : <div className="text-gray-500 mt-10">No friends found.</div>;
          }
        })()}
      </div>
    </div>
  );
}

export default function WrappedMyNetwork() {
  return <PrivateRoute><MyNetwork /></PrivateRoute>;
}
