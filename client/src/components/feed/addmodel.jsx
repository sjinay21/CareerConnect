"use client";
import { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import Textarea from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";

export default function AddModel({ onPost }) {
  const { profile } = useProfile();
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handlePost() {
    if (!postText.trim() && !selectedImage) {
      return;
    }
    
    const formData = new FormData();
    formData.append("content", postText);
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    
    await onPost(formData);
  }

  return (
    <div>
      <div className="flex gap-3 items-center">
        <div className="relative">
          <img
            className="w-12 h-12 object-cover rounded-full"
            alt="profile"
            src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
          />
        </div>
        <div className="text-2xl font-semibold">{profile?.name || "User"}</div>
      </div>
      <div>
        <Textarea
          cols="65"
          rows="5"
          placeholder="What do you want to talk about?"
          variant="assign"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        >
        </Textarea>
      </div>

      {previewUrl && (
        <div className="relative my-3">
          <img className="max-w-full h-40 object-cover rounded-xl" src={previewUrl} alt="Preview" />
          <button 
            className="absolute top-1 left-1 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
          >
            X
          </button>
        </div>
      )}
      <div className="flex justify-between items-center mt-3">
        <div className="my-2">
          <label className="cursor-pointer text-gray-600 hover:text-black p-2 rounded-full hover:bg-gray-100 transition" htmlFor="inputfile">
            <ImageIcon />
          </label>
          <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            id="inputfile"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex-1"></div>
        <button
          onClick={handlePost}
          className="cursor-pointer text-white font-semibold bg-blue-700 hover:bg-blue-800 py-2 px-6 rounded-full self-center"
        >
          Post
        </button>
      </div>
    </div>
  );
}
