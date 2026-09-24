"use client";
import { useState, useEffect } from "react";
import { islikePost, getComments, addComment } from "@/utils/api";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import Card from "@/components/shared/card";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import CommentReplies from "./CommentReplies";
import SmallModel from "@/components/shared/smallmodel";
import { toast } from "react-hot-toast";

export default function SocialActions({ postId, initialLikes, initialLiked, initialCommentsCount, triggerShare, onShareClose }) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(initialLiked || false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount || 0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [hasFetchedComments, setHasFetchedComments] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [generatedShareUrl, setGeneratedShareUrl] = useState("");

  useEffect(() => {
    if (triggerShare) {
      openSharePopup();
    }
  }, [triggerShare]);

  const generateShareId = (length = 8) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const openSharePopup = () => {
    const randomStr = generateShareId(8);
    // Using window.location.origin ensures it works on your local machine (localhost:3000)
    // Using window.location.origin is REQUIRED for the browser to know this is a real web address
    // It will dynamically resolve to http://localhost:3000 on your machine.
    const url = `${window.location.origin}/post/${randomStr}${postId}`;
    setGeneratedShareUrl(url);
    setShowSharePopup(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedShareUrl);
    toast.success("Link copied to clipboard!");
    setShowSharePopup(false);
  };

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

  const formatComments = (rawComments) => {
    const comment = {};
    const nestedComments = [];

    // 1. Initialize every comment into a map using a basic for-loop
    for (let i = 0; i < rawComments.length; i++) {
      const c = rawComments[i];
      comment[c.id] = { 
        id: c.id, 
        text: c.content, 
        authorName: c.name, 
        authorSummary: c.summary, 
        created_at: c.created_at,
        replies: [] 
      };
    }

    // 2. Build the nested nestedComments based on parent_comment_id
    for (let i = 0; i < rawComments.length; i++) {
      const c = rawComments[i];
      if (c.parent_comment_id) {
        if (comment[c.parent_comment_id]) {
          comment[c.parent_comment_id].replies.push(comment[c.id]);
        }
      } else {
        nestedComments.push(comment[c.id]);
      }
    }

    return nestedComments;
  };

  useEffect(() => {
    if (showComments && !hasFetchedComments) {
      const fetchComments = async () => {
        try {
          const response = await getComments(postId);
          const data = await response.json();
          if (data.success) {
            setComments(formatComments(data.comments));
            setHasFetchedComments(true);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    }
  }, [showComments, postId, hasFetchedComments]);

  async function handleonSubmit(e) {
    e.preventDefault();
    if (commentText.trim() === "") return;

    try {
      const response = await addComment(postId, commentText);
      const data = await response.json();
      
      if (data.success) {
        const updatedResponse = await getComments(postId);
        const updatedData = await updatedResponse.json();
        if (updatedData.success) {
          setComments(formatComments(updatedData.comments));
          setCommentsCount(prev => prev + 1);
        }
        setCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  async function addReply(parentCommentId, replyText) {
    try {
      const response = await addComment(postId, replyText, parentCommentId);
      const data = await response.json();
      
      if (data.success) {
        // Refetch the comments nestedComments so the reply gets nested in the right place automatically!
        const updatedResponse = await getComments(postId);
        const updatedData = await updatedResponse.json();
        if (updatedData.success) {
          setComments(formatComments(updatedData.comments));
          setCommentsCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
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
          {commentsCount} Comments
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
          onClick={openSharePopup}
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

      {showSharePopup && (
        <SmallModel title="Share post" onClose={() => {
          setShowSharePopup(false);
          if (onShareClose) onShareClose();
        }}>
          <div className="flex flex-col gap-4 py-6 px-2">
            <div className="break-all text-sm text-gray-700 font-medium">
              {generatedShareUrl}
            </div>
            <div className="flex justify-end">
              <Buttonvariants onClick={handleCopyLink} variant="postsend">
                Copy link
              </Buttonvariants>
            </div>
          </div>
        </SmallModel>
      )}
    </Card>
  );
}
