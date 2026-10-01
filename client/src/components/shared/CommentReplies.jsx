"use client";
import { useState } from "react";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function CommentReplies({ comment, addReply }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  function handleReplySubmit(e) {
    e.preventDefault();
    if (!replyText.trim()) {
      return;
    }
    addReply(comment.id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  }

  return (
    <div className="my-4 w-full">
      <div className="relative flex gap-3 items-start w-full">
        <img
          className="w-8 h-8 rounded-full shrink-0 object-cover bg-white"
          src={comment.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"}
          alt="image"
        />
        <div className="flex-1 min-w-0 pr-24">
          <div className="text-md">
            {comment.authorName || "User"}
          </div>
          <div className="text-sm text-gray-500">
            {comment.authorSummary || "LinkedIn Member"}
          </div>
          <div className="mt-1 ">
            {comment.text}
          </div>
        </div>
        <div className="absolute right-0 top-0">
          <Buttonvariants
            type="button"
            variant="postsend"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            Reply
          </Buttonvariants>
        </div>
      </div>

      {showReplyInput && (
        <form
          onSubmit={handleReplySubmit}
          className="flex gap-2 mt-3 w-full"
        >
          <div className="flex-1 min-w-0">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply"
              variant="primary"
            />
          </div>

          <div className="shrink-0">
            <Buttonvariants type="submit" variant="postsend">
              Send
            </Buttonvariants>
          </div>
        </form>
      )}
      {comment.replies.length > 0 && (
        <div className="ml-8 mt-3 border-l border-gray-200 pl-4">
          {comment.replies.map((reply) => (
            <CommentReplies
              key={reply.id}
              comment={reply}
              addReply={addReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
