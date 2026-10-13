"use client";
import PrivateRoute from "@/Route/privateroute";
import Card from "@/components/shared/card";
import Profile from "@/components/profile/profile";
import Advertisement from "@/components/feed/advertisement";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { getConnections, updateConnectionStatus } from "@/utils/api";
import Buttonvariants from "@/components/ui/button";
import { useAppNavigation } from "@/hooks/useNavigation";

const Notification = () => {
  const { profile } = useProfile();
  const { goToProfile } = useAppNavigation();
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await getConnections();
        if (response.ok) {
          const data = await response.json();
          setReceivedRequests(data.received || []);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    }
    fetchNotifications();
  }, []);

  const handleAction = async (connectionId, status) => {
    try {
      const response = await updateConnectionStatus(connectionId, status);
      if (response.ok) {
        setReceivedRequests((prev) =>
          prev.filter((req) => req.connectionId !== connectionId),
        );
      }
    } catch (error) {
      console.error(`Error updating connection to ${status}:`, error);
    }
  };

  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-3 md:px-8 py-4 md:py-9 flex flex-col lg:flex-row gap-5 lg:gap-0">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-[25%] py-5">
          <div className="h-fit">
            <Profile user={profile} />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[50%] py-5 lg:px-5">
          <Card padding={0}>
            <div className="w-full">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((req) => (
                  <div
                    key={req.connectionId}
                    className="border-b-1 flex justify-between items-center border-gray-300 p-3"
                  >
                    <div
                      className="flex gap-4 items-center cursor-pointer"
                      onClick={() => req.user?.id && goToProfile(req.user.id)}
                    >
                      <img
                        src={
                          req.user.profilePicture ||
                          "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                        }
                        alt="profile"
                        className="rounded-full border-2 h-16 w-16 border-white object-cover"
                      />
                      <div>
                        <span className="font-semibold hover:underline">{req.user.name}</span>{" "}
                        sent you a connection request.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Buttonvariants
                        variant="active"
                        onClick={() =>
                          handleAction(req.connectionId, "accepted")
                        }
                      >
                        Accept
                      </Buttonvariants>
                      <Buttonvariants
                        variant="outline"
                        onClick={() =>
                          handleAction(req.connectionId, "rejected")
                        }
                      >
                        Reject
                      </Buttonvariants>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-gray-500 text-center">
                  No new notifications.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:w-[25%] py-5">
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
