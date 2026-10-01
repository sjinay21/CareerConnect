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

export default function Conversation({ user, onClick, isSelected }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center w-full border-b p-4 hover:bg-gray-100 cursor-pointer border-gray-300 ${
        isSelected ? 'bg-gray-200 hover:bg-gray-200' : 'bg-white hover:bg-gray-200'
      }`}
    >
      <div className="shrink-0 mr-3">
        <img
          src={user?.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"}
          alt="image"
          className="rounded-full h-12 w-12 object-cover bg-white"
        />
      </div>

      <div>
        <div className="text-md font-semibold">{user?.name}</div>
        <div className="text-sm text-gray-500">{user?.summary || user?.position}</div>
      </div>
    </div>
  );
}