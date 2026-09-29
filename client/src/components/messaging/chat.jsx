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
*/

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
      userId: user?.id,
      text: message,
      side: side,
    };
    setChats([...chat, newchat]);
    setMessage("");
  }
  const userChats = chat.filter((msg) => msg.userId === user?.id);
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
          <div className="text-sm text-gray-500">{user?.summary || user?.position || "LinkedIn Member"}</div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {userChats.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${
              msg.side == "left" ? "justify-start" : "justify-end"
            }`}
          >
            <p
              className={`text-white px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                msg.side == "left" ? "bg-blue-600" : "bg-green-700"
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
            variant={side == "left" ? "leftActive" : "inactive"}
            onClick={() => setSide("left")}
          >
            Left
          </Buttonvariants>

          <Buttonvariants
            variant={side == "right" ? "rightActive" : "inactive"}
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
