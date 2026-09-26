"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState } from "react";
import Profile from "@/components/profile/profile";
import Buttonvariants from "@/components/ui/button";
function MyNetwork() {
  const [text, settext] = useState("Catchup your friend");
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
        <div>{text}</div>
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
        <div className="md:w-[23%] h-270px sm:w-full">
          <Profile />
        </div>
        <div className="md:w-[23%] h-270px sm:w-full">
          <Profile />
        </div>
        <div className="md:w-[23%] h-270px sm:w-full">
          <Profile />
        </div>
      </div>
    </div>
  );
}


export default function WrappedMyNetwork() {
  return <PrivateRoute><MyNetwork /></PrivateRoute>;
}
