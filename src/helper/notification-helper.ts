// utils/notificationHelper.js
import { supabase } from "../supabaseClient";

export async function sendLikeNotification(postId, likerId, postOwnerId) {
  // Don't send notification if user likes their own post
  if (likerId === postOwnerId) {
    return;
  }

  try {
    // Get liker's profile info
    const { data: likerProfile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("user_id", likerId)
      .single();

    // Get post info
    const { data: post } = await supabase
      .from("posts")
      .select("content")
      .eq("id", postId)
      .single();

    // Create notification
    const { error } = await supabase.from("notifications").insert({
      user_id: postOwnerId,
      type: "like",
      message: `${likerProfile?.username || "Someone"} liked your post`,
      data: {
        post_id: postId,
        liker_id: likerId,
        liker_username: likerProfile?.username,
        liker_avatar: likerProfile?.avatar_url,
        post_preview: post?.content?.substring(0, 50) + "...",
      },
    });

    if (error) {
      console.error("Failed to create notification:", error);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
