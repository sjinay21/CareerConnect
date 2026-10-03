"use client";
import React, { useState, useEffect } from "react";
import InfoOutlineTwoToneIcon from '@mui/icons-material/InfoOutlineTwoTone';

export default function InfoMessage({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
  }, [isVisible]);

  return (
    <div className="absolute right-3 inset-y-0 flex items-center">
      <div 
        className="cursor-pointer text-black hover:text-black transition-colors flex items-center" 
        onClick={() => setIsVisible(!isVisible)}
      >
        <InfoOutlineTwoToneIcon />
      </div>
      {isVisible && (
        <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-white border border-gray-200  rounded-md z-50 text-sm text-black">
          {message}
        </div>
      )}
    </div>
  );
}
