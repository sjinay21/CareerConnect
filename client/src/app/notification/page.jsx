"use client";
import PrivateRoute from "@/Route/privateroute";
import Card from "@/components/shared/card";
import Post from "@/components/feed/post";
import Profile from "@/components/profile/profile";
import Advertisement from "@/components/feed/advertisement";
import Model from "@/components/shared/model";
import AddModel from "@/components/feed/addmodel";

const Notification = () => {
  return (
    <div className="px-3 xl:px-5 py-9 flex gap-5 w-full bg-gray-100">
      <div className="w-[21%] sm:block sm:w-[23%] py-5">
        <div className="h-fit">
          <Profile />
        </div>
      </div>
      <div className="w-[100%] py-5 sm:w-[50%]">
        <Card padding={0}>
          <div className="w-full">
            <div
              className={`border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3`}
            >
              <img
                src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                alt="image"
                className="rounded-full border-2 h-16 w-16 border-white cursor-pointer"
              />
              <div>Dummy user had sent you request!</div>
            </div>
            <div
              className={`border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3`}
            >
              <img
                src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                alt="image"
                className="rounded-full border-2 h-16 w-16 border-white cursor-pointer"
              />
              <div>Dummy user had sent you request!</div>
            </div>
            <div
              className={`border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3`}
            >
              <img
                src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                alt="image"
                className="rounded-full border-2 h-16 w-16 border-white cursor-pointer"
              />
              <div>Dummy user had sent you request!</div>
            </div>
            <div
              className={`border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3`}
            >
              <img
                src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                alt="image"
                className="rounded-full border-2 h-16 w-16 border-white cursor-pointer"
              />
              <div>Dummy user had sent you request!</div>
            </div>
            <div
              className={`border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3`}
            >
              <img
                src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                alt="image"
                className="rounded-full border-2 h-16 w-16 border-white cursor-pointer"
              />
              <div>Dummy user had sent you request!</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-[26%] py-5 md:block">
        <div>
          <Card padding={1}>
            <div className="text-xl">LinkedIn News</div>
            <div className="text-gray-600">Top stories</div>
            <div className="my-1">
              <div className="text-md">Buffett to remain Berkshire chair</div>
              <div className="text-xs text-gray-400">2h ago</div>
            </div>
            <div className="my-1">
              <div className="text-md">Foreign invertment surge again</div>
              <div className="text-xs text-gray-400">3h ago</div>
            </div>
          </Card>
        </div>
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default function WrappedNotification() {
  return (
    <PrivateRoute>
      <Notification />
    </PrivateRoute>
  );
}
