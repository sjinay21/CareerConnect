import React from "react";

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  variant = "",
  className = "",
  ...props
}) {
  const variants = {
    primary: "w-full border py-3 px-5 rounded-3xl hover:bg-gray-100",
    outline:
      "w-full border rounded-lg p-2 text-black outline-none focus:border-blue-500",
    secondary: "border border-gray-300 rounded-lg p-2 w-full",
    search:
      "bg-white rounded-sm w-full h-10 pl-10 pr-4 outline-none border border-black hover:border-black focus:border-black text-black",
  };

  const inputClass = `${variants[variant] || ""} ${className}`.trim();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={inputClass}
      {...props}
    />
  );
}

export default Input;
