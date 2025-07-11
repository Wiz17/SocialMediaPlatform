// useRealtimeLikes.js
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://arxkebsmrbstwstaxbig.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeGtlYnNtcmJzdHdzdGF4YmlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEyNDkwNiwiZXhwIjoyMDQ4NzAwOTA2fQ.B5q-bi3Rz33jzgkz8QgGNQyKso3g2clpNxxc5Uu-_vk"; // Replace with your API key

const supabase = createClient(SUPABASE_URL, API_KEY);

export function useRealtimeLikes(userId) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Channel for receiving notifications
    const channel = supabase
      .channel(`user-notifications:${userId}`)
      .on("broadcast", { event: "new-like" }, (payload) => {
        console.log("New like notification:", payload);
        handleNewLikeNotification(payload.payload);
      })
      .subscribe();

    // Listen to database changes on likes2 table
    const likesSubscription = supabase
      .channel("likes-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "likes2",
        },
        async (payload) => {
          // Check if this like is for current user's post
          await checkAndNotifyPostOwner(payload.new);
        },
      )
      .subscribe();

    // Load existing notifications
    loadNotifications();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(likesSubscription);
    };
  }, [userId]);

  const checkAndNotifyPostOwner = async (likeData) => {
    // Get post details
    const { data: post } = await supabase
      .from("posts")
      .select("user_id, title")
      .eq("id", likeData.post_id)
      .single();

    if (post && post.user_id === userId && likeData.user_id !== userId) {
      // Get liker details
      const { data: liker } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("user_id", likeData.user_id)
        .single();

      const notification = {
        id: crypto.randomUUID(),
        type: "like",
        message: `${liker?.username || "Someone"} liked your post`,
        post_id: likeData.post_id,
        post_title: post.title,
        liker: liker,
        created_at: new Date().toISOString(),
        is_read: false,
      };

      handleNewLikeNotification(notification);
    }
  };

  const handleNewLikeNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Like!", {
        body: notification.message,
        icon: notification.liker?.avatar_url || "/default-avatar.png",
      });
    }

    // Play notification sound
    playNotificationSound();
  };

  const loadNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setNotifications(data);
    }
  };

  const markAsRead = async (notificationId) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)),
    );
  };

  const playNotificationSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.is_read).length,
    markAsRead,
  };
}
