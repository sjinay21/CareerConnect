"use client";
import Card from "@/components/shared/card";
import { useState } from "react";
import Buttonvariants from "@/components/ui/button";
import SocialActions from "@/components/shared/socialactions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useProfile } from "@/hooks/useProfile";
import Model from "@/components/shared/model";
import EditModel from "./editmodel";
import CloseIcon from "@mui/icons-material/Close";

export default function Post({ post, onEdit, onDelete }) {
  const { profile } = useProfile();
  const [seemore, setSeemore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [triggerShare, setTriggerShare] = useState(false);
  const desc = post?.content || "";

  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = profile?.id == post?.authorId;
  const handleDelete = () => {
    setShowDropdown(false);
    setIsDeleting(true);
  };
  const handleEditSave = async (formData) => {
    const result = await onEdit(post.id, formData.get("content"), formData);
    if (result.success) {
      setIsEditing(false);
    } else {
      alert("Failed to update post:" + result.message);
    }
  };

  return (
    <>
      <Card padding={0}>
        <div className="flex justify-between p-4 relative">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-4xl">
              <img
                className="rounded-4xl w-12 h-12 border-white cursor-pointer object-cover bg-white"
                src={
                  post?.authorProfilePicture ||
                  "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                }
                alt="image"
              />
            </div>

            <div>
              <div className="text-lg font-semibold">
                {post?.authorName || "User"}
              </div>
              <div className="text-xs text-gray-500">
                {post?.authorSummary || "LinkedIn Member"}
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="relative">
              <div
                className="p-1 rounded-full hover:bg-gray-200 cursor-pointer transition"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MoreVertIcon className="text-gray-600" />
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 z-10 py-1">
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold text-sm transition"
                    onClick={() => {
                      setIsEditing(true);
                      setShowDropdown(false);
                    }}
                  >
                    <EditIcon fontSize="small" />
                    <span>Edit Post</span>
                  </div>
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold text-sm transition"
                    onClick={() => {
                      setShowDropdown(false);
                      setTriggerShare(true);
                    }}
                  >
                    <SendIcon fontSize="small" />
                    <span>Share Post</span>
                  </div>
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-600 font-semibold text-sm transition"
                    onClick={handleDelete}
                  >
                    <DeleteIcon fontSize="small" />
                    <span>Delete Post</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-md p-4 my-3 whitespace-pre-line break-words">
          {desc.length > 100 ? (
            <>
              {seemore ? desc : `${desc.slice(0, 100)}...`}
              <Buttonvariants
                variant="post"
                onClick={() => setSeemore(!seemore)}
              >
                {seemore ? "See less" : "See more"}
              </Buttonvariants>
            </>
          ) : (
            desc
          )}
        </div>

        {post?.mediaUrl && (
          <div className="w-full h-[300px]">
            <img
              className="w-full h-full object-contain bg-gray-100"
              src={post.mediaUrl}
              alt="post"
            />
          </div>
        )}

        <SocialActions
          postId={post.id}
          initialLikes={post.likesCount}
          initialLiked={post.isLikedByUser}
          initialCommentsCount={post.commentsCount}
          triggerShare={triggerShare}
          onShareClose={() => setTriggerShare(false)}
        />
      </Card>

      {isEditing && (
        <Model title="Edit Post" onClose={() => setIsEditing(false)}>
          <EditModel post={post} onSave={handleEditSave} />
        </Model>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Delete Post</h2>
              <button
                onClick={() => setIsDeleting(false)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 md:p-6">
              <p className="text-lg text-center text-black font-medium mb-8 pb-6">
                Are you sure you want to delete this post?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-6 py-2 bg-gray-50 border border-black rounded-md text-black font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(false);
                    await onDelete(post.id);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
