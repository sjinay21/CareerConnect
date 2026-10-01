/*
// OLD IMPLEMENTATION - kept for reference
// Replaced to add onMessage prop and Message button for chat creation
import Card from "@/components/shared/card";
import Buttonvariants from "@/components/ui/button";

export default function Profile({ user, showFollowButton = false, connectionStatus = 'none', onFollow }) {

  return (
    <Card padding={0}>
      <div className="relative h-[110px]">
        <div className="relative w-full h-[80px] rounded-md">
          <img
            src="/images.jpg"
            alt="profile"
            className="rounded-t-md h-full w-full object-cover"
          />
        </div>
        <div className="absolute top-10 left-6 z-10">
          <img
            src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
            alt="image"
            className="rounded-full border-2 h-16 w-16 border-white cursor-pointer object-cover"
          />
        </div>
      </div>
      <div className="p-5 mt-3">
        <div className="text-xl font-semibold">{user?.name}</div>
        <div className="text-sm my-1 text-gray-700">{user?.summary}</div>
        <div className="text-sm my-1 text-gray-500">{user?.location}</div>
        
        {showFollowButton && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
            <Buttonvariants 
              variant="outline" 
              className="w-full"
              onClick={onFollow}
              disabled={connectionStatus == 'pending' || connectionStatus == 'connected'}
            >
              {connectionStatus == 'connected' ? 'Connected' : connectionStatus == 'pending' ? 'Pending' : 'Follow'}
            </Buttonvariants>
          </div>
        )}
      </div>
    </Card>
  );
}
*/

import Card from "@/components/shared/card";
import Buttonvariants from "@/components/ui/button";

export default function Profile({ user, showFollowButton = false, connectionStatus = 'none', onFollow, onMessage }) {

  return (
    <Card padding={0}>
      <div className="relative h-[110px]">
        <div className="relative w-full h-[80px] rounded-md">
          <img
            src={user?.banner_url || "/images.jpg"}
            alt="profile"
            className="rounded-t-md h-full w-full object-cover"
          />
        </div>
        <div className="absolute top-10 left-6 z-10">
          <img
            src={user?.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"}
            alt="image"
            className="rounded-full border-2 h-16 w-16 border-white cursor-pointer object-cover bg-white"
          />
        </div>
      </div>
      <div className="p-5 mt-3">
        <div className="text-xl font-semibold">{user?.name}</div>
        <div className="text-sm my-1 text-gray-700">{user?.summary}</div>
        <div className="text-sm my-1 text-gray-500">{user?.location}</div>
        
        {showFollowButton && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2 justify-center">
            <Buttonvariants 
              variant="outline" 
              className="w-full"
              onClick={onFollow}
              disabled={connectionStatus == 'pending' || connectionStatus == 'connected'}
            >
              {connectionStatus == 'connected' ? 'Connected' : connectionStatus == 'pending' ? 'Pending' : 'Follow'}
            </Buttonvariants>
            {onMessage && (
              <Buttonvariants 
                variant="outline" 
                className="w-full"
                onClick={onMessage}
              >
                Message
              </Buttonvariants>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
