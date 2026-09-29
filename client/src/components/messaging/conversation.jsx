/*
// OLD IMPLEMENTATION - kept for reference
// Replaced to handle user summary instead of user position
export default function Conversation({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center w-full border-b border-gray-400 p-4 hover:bg-gray-200 cursor-pointer"
    >
      <div className="shrink-0">
        <img
          src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
          alt="image"
          className="rounded-full h-12 w-12"
        />
      </div>

      <div>
        <div className="text-md">{user?.name}</div>
        <div className="text-sm text-gray-500">{user?.position}</div>
      </div>
    </div>
  );
}
*/

export default function Conversation({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center w-full border-b border-gray-400 p-4 hover:bg-gray-200 cursor-pointer"
    >
      <div className="shrink-0 mr-3">
        <img
          src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
          alt="image"
          className="rounded-full h-12 w-12"
        />
      </div>

      <div>
        <div className="text-md font-semibold">{user?.name}</div>
        <div className="text-sm text-gray-500">{user?.summary || user?.position}</div>
      </div>
    </div>
  );
}