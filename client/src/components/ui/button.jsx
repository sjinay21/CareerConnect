function Buttonvariants({ children, variant = "",type = "", onClick,onSubmit }) {
  const variants = {
    primary:"w-full hover:bg-blue-900 bg-blue-800 text-white py-3 px-4 rounded-xl text-center text-xl cursor-pointer my-2",
    outline:"rounded-lg p-1 border border-gray-300",
    active:"rounded-lg p-1 border border-gray-300 bg-blue-900 text-white",
    chatsend:"bg-green-700 text-white px-5 rounded-lg",
    leftActive:"px-4 py-1 rounded-lg border bg-blue-600 text-white",
    rightActive:"px-4 py-1 rounded-lg border bg-green-700 text-white",
    inactive:"px-4 py-1 rounded-lg border bg-white text-gray-700",
    cancel:"px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100",
    expsend:"px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700",
    postsend:"cursor-pointer bg-blue-400 text-white rounded-3xl py-1 px-3",
    post:"text-blue-500 hover:underline",
    psend:"px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
  };

  return (
    <button className={variants[variant]} type={type} onSubmit={onSubmit} onClick={onClick}>
      {children}
    </button>
  );
}

export default Buttonvariants;