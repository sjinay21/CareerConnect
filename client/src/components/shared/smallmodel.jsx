import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function SmallModel({ title, onClose, children }) {
  return (
    <div className="bg-black/50 fixed top-0 left-0 inset-0 z-20 flex justify-center items-center">
      <div className="w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        <div className="flex justify-between border-b pb-3 mb-3 border-gray-100">
          <div className="flex gap-4 items-center">
            <div className="text-xl text-black font-semibold">{title}</div>
          </div>
          <div
            className="cursor-pointer text-gray-500 hover:text-black transition"
            onClick={onClose}
          >
            <CloseIcon />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
