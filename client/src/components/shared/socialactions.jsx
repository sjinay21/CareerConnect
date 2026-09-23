"use client";
import { useState } from "react";
import { islikePost } from "@/utils/api";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import Card from "@/components/shared/card";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import CommentReplies from "./CommentReplies";

export default function SocialActions({ postId, initialLikes, initialLiked }) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(initialLiked || false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  async function handleLike() {
    const prevLiked = liked;
    const prevLikes = likes;
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    try {
      const response = await islikePost(postId);
      const data = await response.json();
      if (response.ok) {
        setLiked(data.liked);
        setLikes(data.likesCount);
      } else {
        setLiked(prevLiked);
        setLikes(prevLikes);
      }
    } catch (error) {
      setLiked(prevLiked);
      setLikes(prevLikes);
      console.error("Error toggling like:", error);
    }
  }
  function handleonSubmit(e) {
    e.preventDefault();
    if (commentText.trim() === "") {
      return;
    }
    const newcomment = {
      id: crypto.randomUUID(),
      text: commentText,
      replies: [],
    };
    setComments((prev) => [...prev, newcomment]);
    setCommentText("");
  }
  function addReply(commentId, replyText) {
    const newReply = {
      id: crypto.randomUUID(),
      text: replyText,
      replies: [],
    };
    function updateComments(commentList) {
      return commentList.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return {
          ...comment,
          replies: updateComments(comment.replies),
        };
      });
    }
    setComments((prev) => updateComments(prev));
  }

  return (
    <Card padding={0}>
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
        <div className="flex gap-1 items-center">
          <ThumbUpIcon sx={{ color: "blue", fontSize: 14 }} />

          <span className="text-sm text-gray-600">
            {likes} Likes
          </span>
        </div>
        <span className="text-sm text-gray-600">
          {comments.length} Comments
        </span>
      </div>
      <div className="flex border-b border-gray-100">
        <button
          type="button"
          onClick={handleLike}
          className="w-1/3 py-3 flex justify-center items-center gap-2 border-r border-gray-100 cursor-pointer hover:bg-gray-100"
        >
          {liked ? (
            <ThumbUpIcon sx={{ color: "blue", fontSize: 22 }} />
          ) : (
            <ThumbUpOutlinedIcon sx={{ fontSize: 22 }} />
          )}

          <span>Like</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="w-1/3 py-3 flex justify-center items-center gap-2 border-r border-gray-100 cursor-pointer hover:bg-gray-100"
        >
          <CommentIcon sx={{ fontSize: 22 }} />

          <span>Comments</span>
        </button>

        <button
          type="button"
          className="w-1/3 py-3 flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-100"
        >
          <SendIcon sx={{ fontSize: 22 }} />

          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="p-4">
    
          <div className="flex gap-3 items-center">
            <img
              src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
              className="w-10 h-10 rounded-full shrink-0"
              alt="user"
            />

            <form
              className="flex gap-2 flex-1"
              onSubmit={handleonSubmit}
            >
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment"
                variant="primary"
              />

              <Buttonvariants type="submit" variant="postsend">
                Send
              </Buttonvariants>
            </form>
          </div>

          <div className="mt-5">
            {comments.map((comment) => (
              <CommentReplies
                key={comment.id}
                comment={comment}
                addReply={addReply}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
