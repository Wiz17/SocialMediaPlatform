import React, { useEffect, useState } from "react";
import LeftNav from "../components/leftNav.tsx";
import { createClient } from "@supabase/supabase-js";

// Use environment variables
const SUPABASE_URL = "https://arxkebsmrbstwstaxbig.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeGtlYnNtcmJzdHdzdGF4YmlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEyNDkwNiwiZXhwIjoyMDQ4NzAwOTA2fQ.B5q-bi3Rz33jzgkz8QgGNQyKso3g2clpNxxc5Uu-_vk";

const supabase = createClient(SUPABASE_URL, API_KEY);

interface Notification {
  id: string;
  user_id: string;
  type: string;
  actor_id: string;
  post_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    username: string;
    profile_picture: string;
  };
  post?: {
    content: string;
    image?: string;
  };
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (currentUserId) {
      fetchNotifications();
      unsubscribe = subscribeToNotifications();
    }

    // Clean up subscription on unmount or when currentUserId changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUserId]);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          *,
          actor:actor_id(username, profile_picture),
          post:post_id(content, image)
        `,
        )
        .eq("user_id", currentUserId) // Add this filter
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    console.log("Setting up subscription for user:", currentUserId);

    const subscription = supabase
      .channel(`notifications-${currentUserId}`) // Unique channel name
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        async (payload) => {
          console.log("Received notification payload:", payload);

          try {
            // Fetch the complete notification with user details
            const { data, error } = await supabase
              .from("notifications")
              .select(
                `
                *,
                actor:actor_id(username, profile_picture),
                post:post_id(content, image)
              `,
              )
              .eq("id", payload.new.id)
              .single();

            if (error) {
              console.error("Error fetching notification details:", error);
              return;
            }

            if (data) {
              console.log("Adding notification to list:", data);
              setNotifications((prev) => [data, ...prev]);

              // Show browser notification
              if (Notification.permission === "granted") {
                new Notification("New Like!", {
                  body: `${data.actor?.username || "Someone"} liked your post`,
                  icon: data.actor?.profile_picture || "/default-avatar.png",
                });
              }
            }
          } catch (err) {
            console.error("Error processing notification:", err);
          }
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to notifications");
        }
      });

    return () => {
      console.log("Unsubscribing from notifications");
      subscription.unsubscribe();
    };
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", currentUserId) // Add user filter
      .eq("is_read", false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Your JSX remains the same...
  return (
    <div className="flex">
      <div className="max-sm:hidden w-[15%]" />
      <LeftNav />
      <div className="w-full sm:w-[85%] min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto p-3 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {unreadCount} unread
                </p>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs sm:text-sm"
              >
                Enable Alerts
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs sm:text-sm"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm sm:text-base">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    !notification.is_read && markAsRead(notification.id)
                  }
                  className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                    notification.is_read
                      ? "bg-gray-900 hover:bg-gray-800"
                      : "bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800/30"
                  }`}
                >
                  <img
                    src={
                      notification.actor?.profile_picture ||
                      "/default-avatar.png"
                    }
                    alt={notification.actor?.username}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm break-words">
                      <span className="font-semibold">
                        {notification.actor?.username || "Someone"}
                      </span>{" "}
                      {notification.message}
                    </p>
                    {notification.post && (
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2 break-words">
                        "{notification.post.content}"
                      </p>
                    )}
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-1">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
