"use client";
import Card from "@/components/shared/card";
import { useState } from "react";
import Buttonvariants from "@/components/ui/button";
import SocialActions from "@/components/shared/socialactions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useProfile } from "@/hooks/useProfile";
import Model from "@/components/shared/model";
import EditModel from "./editmodel";
import { toast } from "react-hot-toast";

export default function Post({ post, onEdit, onDelete }) {
  const { profile } = useProfile();
  const [seemore, setSeemore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const desc = post?.content || "";

  const isAuthor = profile?.id == post?.authorId;
  const handleDelete = async () => {
    setShowDropdown(false);
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-2xl rounded-xl border border-gray-200 p-5 flex flex-col gap-4 items-center`}>
        <span className="font-semibold text-gray-800 text-base text-center">Are you sure you want to delete this post?</span>
        <div className="flex gap-3 justify-center mt-1 w-full">
          <button 
            className="flex-1 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium border border-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="flex-1 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium shadow-sm"
            onClick={async () => {
              toast.dismiss(t.id);
              await onDelete(post.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };
  const handleEditSave = async (formData) => {
    const result = await onEdit(post.id, formData.get("content"), formData);
    if (result.success) {
      setIsEditing(false);
    } else {
      alert("Failed to update post: " + result.message);
    }
  };

  return (
    <>
      <Card padding={0}>
        <div className="flex justify-between p-4 relative">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-4xl">
              <img
                className="rounded-4xl w-12 h-12 border-white cursor-pointer"
                src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                alt="image"
              />
            </div>

            <div>
              <div className="text-lg font-semibold">{post?.authorName || "User"}</div>
              <div className="text-xs text-gray-500">{post?.authorSummary || "LinkedIn Member"}</div>
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
            <img className="w-full h-full object-contain bg-gray-100" src={post.mediaUrl} alt="post" />
          </div>
        )}

        <SocialActions 
          postId={post.id} 
          initialLikes={post.likesCount} 
          initialLiked={post.isLikedByUser} 
        />
      </Card>

      {isEditing && (
        <Model title="Edit Post" onClose={() => setIsEditing(false)}>
          <EditModel post={post} onSave={handleEditSave} />
        </Model>
      )}
    </>
  );
}