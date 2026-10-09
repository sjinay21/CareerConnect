function Buttonvariants({
  children,
  variant = "",
  type = "",
  onClick,
  onSubmit,
  disabled = false,
}) {
  const variants = {
    primary:
      "w-full hover:bg-blue-900 bg-blue-800 text-white py-3 px-4 rounded-xl text-center text-xl cursor-pointer my-2",
    outline: "rounded-lg p-1 border border-gray-300",
    active: "rounded-lg p-1 border border-gray-300 bg-blue-900 text-white",
    chatsend: "bg-green-700 text-white px-5 rounded-lg",
    leftActive: "px-4 py-1 rounded-lg border bg-blue-600 text-white",
    rightActive: "px-4 py-1 rounded-lg border bg-green-700 text-white",
    inactive: "px-4 py-1 rounded-lg border bg-white text-gray-700",
    cancel: "px-4 py-2 border rounded-lg cursor-pointer bg-white text-black",
    expsend:
      "px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700",
    postsend: "cursor-pointer bg-blue-400 text-white rounded-3xl py-1 px-3",
    post: "text-blue-500 hover:underline",
    psend:
      "px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700",
    createJobSubmit:
      "bg-blue-700 text-white hover:bg-blue-800 px-6 py-2 rounded-full font-semibold",
    createJobCancelBtn:
      "px-5 py-2 rounded-full font-semibold text-gray-600 hover:bg-gray-100",
    createJobCancelText:
      "text-gray-500 hover:text-gray-700 font-semibold text-sm",
    jobApply:
      "bg-blue-700 text-white hover:bg-blue-800 p-1.5 rounded-full text-sm font-semibold px-5 flex items-center justify-center gap-1.5",
    jobApplied:
      "bg-blue-700 text-white p-1.5 rounded-full text-sm font-semibold px-5 flex items-center justify-center gap-1.5 cursor-not-allowed",
    jobIconMore:
      "text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors border border-transparent hover:border-gray-300",
    jobIconDelete:
      "absolute top-4 right-4 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full p-1 transition-colors",
    jobPremium:
      "bg-[#f8c77e] hover:bg-[#f0b55b] text-black font-semibold rounded-full px-4 py-1.5 text-sm transition-colors",
    jobMatchOutline:
      "border border-gray-500 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-gray-100 hover:border-gray-700 text-gray-700 flex items-center gap-2",
  };
  return (
    <button
      className={variants[variant]}
      type={type}
      onSubmit={onSubmit}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Buttonvariants;
