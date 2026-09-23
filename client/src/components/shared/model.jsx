import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function Modeltitle ({ title, onClose, children }){
  return (
    <div className="bg-black/50 fixed top-0 left-0 inset-0 z-20 flex justify-center items-center">
      <div className="w-[90%] md:w-[50%] max-h-[90vh] overflow-y-auto bg-white rounded-xl p-8">
        <div className="flex justify-between">
          <div className="flex gap-4 items-center">
            <div className="text-xl text-black">
              {title}
            </div>
          </div>
          <div
            className="cursor-pointer"
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