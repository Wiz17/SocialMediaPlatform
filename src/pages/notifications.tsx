import React, { useEffect, useState } from "react";
import LeftNav from "../components/leftNav.tsx";
import { useRealtimeLikes } from "../hooks/useRealtimeLikes.ts";
import { Bell } from "lucide-react";
const Notifications: React.FC = () => {
  const userId = localStorage.getItem("id"); // Replace with the actual logged-in user ID
  const [taggedUser, setTaggedUser] = useState("");

  const { notifications, unreadCount, markAsRead } = useRealtimeLikes(userId);
  const [showDropdown, setShowDropdown] = useState(false);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      <div className="flex">
        <div className="max-sm:hidden w-[15%]"></div>
        <LeftNav />
        <div className="relative bg-black">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-white"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-700 cursor-pointer ${
                        !notif.is_read ? "bg-gray-900" : ""
                      }`}
                      onClick={() => {
                        markAsRead(notif.id);
                        // Navigate to post if needed
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {notif.data?.liker_avatar && (
                          <img
                            src={notif.data.liker_avatar}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-white">{notif.message}</p>
                          {notif.data?.post_preview && (
                            <p className="text-xs text-gray-400 mt-1">
                              "{notif.data.post_preview}"
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Notifications;
