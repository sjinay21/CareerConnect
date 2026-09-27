"use client";
import PrivateRoute from "@/Route/privateroute";
import Card from "@/components/shared/card";
import Profile from "@/components/profile/profile";
import Advertisement from "@/components/feed/advertisement";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { getConnections, updateConnectionStatus } from "@/utils/api";
import Buttonvariants from "@/components/ui/button";

const Notification = () => {
  const { profile } = useProfile();
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
        setReceivedRequests(prev => prev.filter(req => req.connectionId !== connectionId));
      }
    } catch (error) {
      console.error(`Error updating connection to ${status}:`, error);
    }
  };

  return (
    <div className="px-3 xl:px-5 py-9 flex gap-5 w-full bg-gray-100">
      <div className="w-[21%] sm:block sm:w-[23%] py-5">
        <div className="h-fit">
          <Profile user={profile} />
        </div>
      </div>
      <div className="w-[100%] py-5 sm:w-[50%]">
        <Card padding={0}>
          <div className="w-full">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div
                  key={req.connectionId}
                  className="border-b-1 flex justify-between items-center border-gray-300 p-3"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src="/images.jpg"
                      alt="profile"
                      className="rounded-full border-2 h-16 w-16 border-white object-cover"
                    />
                    <div>
                      <span className="font-semibold">{req.user.name}</span> sent you a connection request.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Buttonvariants variant="active" onClick={() => handleAction(req.connectionId, 'accepted')}>Accept</Buttonvariants>
                    <Buttonvariants variant="outline" onClick={() => handleAction(req.connectionId, 'rejected')}>Reject</Buttonvariants>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-gray-500 text-center">No new notifications.</div>
            )}
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
