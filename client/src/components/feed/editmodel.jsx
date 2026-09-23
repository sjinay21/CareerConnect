"use client";
import { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import Textarea from "@/components/ui/textarea";

export default function EditModel({ post, onSave }) {
  const [postText, setPostText] = useState(post?.content || "");
  const [selectedImage, setSelectedImage] = useState(null);
  
  // If they have an existing image, show it. If they pick a new one, show that preview.
  const [previewUrl, setPreviewUrl] = useState(post?.mediaUrl || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSave() {
    if (!postText.trim() && !selectedImage && !previewUrl) {
      return;
    }
    
    const formData = new FormData();
    formData.append("content", postText);
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    
    await onSave(formData);
  }

  return (
    <div>
      <div>
        <Textarea
          cols="65"
          rows="5"
          placeholder="What do you want to talk about?"
          variant="assign"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
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
          <label className="cursor-pointer text-gray-600 hover:text-black p-2 rounded-full hover:bg-gray-100 transition" htmlFor="edit-inputfile">
            <ImageIcon />
          </label>
          <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            id="edit-inputfile"
            onChange={handleImageChange}
          />
        </div>
        
        <div className="flex-1"></div>

        <button
          onClick={handleSave}
          className="cursor-pointer text-white font-semibold bg-blue-700 hover:bg-blue-800 py-2 px-6 rounded-full self-center"
        >
          Save
        </button>
      </div>
    </div>
  );
}
