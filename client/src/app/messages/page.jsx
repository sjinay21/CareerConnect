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
