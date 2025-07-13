import React from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "../supabaseClient.jsx";
import { toast } from "sonner";

interface PostCardProps {
  id: string;
  name: string;
  userId: string; // Add post owner's user ID
  userImg: string;
  content: string;
  timeAgo: string;
  postImg: string;
  tagName: string;
  likes: number;
  liked: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  name,
  userId: postOwnerId, // Post owner's ID
  userImg,
  content,
  timeAgo,
  postImg,
  tagName,
  likes,
  liked,
}) => {
  const currentUserId: string = localStorage.getItem("id") || "";
  const [likeBtn, setLikeBtn] = useState<boolean>(liked);
  const [likeCount, setLikeCount] = useState<number>(Number(likes) || 0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Subscribe to real-time like updates for this post
  useEffect(() => {
    const channel = supabase
      .channel(`post-likes:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes2",
          filter: `post_id=eq.${id}`,
        },
        async (payload) => {
          // Update like count based on database changes
          if (payload.eventType === "INSERT") {
            // Someone liked the post
            if (payload.new.user_id !== currentUserId) {
              setLikeCount((prev) => prev + 1);
            }
          } else if (payload.eventType === "DELETE") {
            // Someone unliked the post
            if (payload.old.user_id !== currentUserId) {
              setLikeCount((prev) => Math.max(0, prev - 1));
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, currentUserId]);

  const disLikeHandle = async (postId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Optimistic update
    setLikeBtn(false);
    setLikeCount((prev) => Math.max(0, prev - 1));

    try {
      // Also update in Supabase directly for real-time sync
      await supabase
        .from("likes2")
        .delete()
        .eq("user_id", currentUserId)
        .eq("post_id", postId);
    } catch (error) {
      // Revert on error
      setLikeBtn(true);
      setLikeCount((prev) => prev + 1);
      toast.error("Failed to unlike post");
    } finally {
      setIsProcessing(false);
    }
  };

  const likeHandle = async (postId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Optimistic update
    setLikeBtn(true);
    setLikeCount((prev) => prev + 1);

    try {
      const { data, error } = await supabase
        .from("likes2")
        .insert({
          post_id: postId,
          user_id: currentUserId,
        })
        .select()
        .single();
    } catch (error) {
      // Revert on error
      setLikeBtn(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      toast.error("Failed to like post");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="h-[0.5px] bg-gray-700 w-full mx-auto my-4"></div>

      <div className="flex w-full">
        <div className="w-1/12 min-w-[50px]">
          <img
            src={userImg}
            alt=""
            className="object-cover w-12 h-12 rounded-[50%]"
          />
        </div>
        <div className="ml-3 w-10/12 flex flex-col gap-3">
          <div className="flex items-center">
            <h1 className="text-white font-bold text-lg">{name}</h1>
            <span className="text-gray-500 ml-1">{tagName}</span>
            <p className="text-gray-500 ml-3">{timeAgo}</p>
          </div>
          <p className="text-white -mt-2">{content}</p>
          {postImg && (
            <div className="w-full border border-gray-700 rounded-lg">
              {postImg.endsWith(".mp4") ? (
                <video
                  src={postImg}
                  className="w-full object-contain rounded-lg h-[400px]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  src={postImg}
                  alt="Post"
                  className="w-full object-cover rounded-lg"
                />
              )}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => (likeBtn ? disLikeHandle(id) : likeHandle(id))}
              disabled={isProcessing}
              className={`transition-all ${isProcessing ? "opacity-50" : ""}`}
            >
              {likeBtn ? (
                <HeartFilled
                  style={{ color: "red", fontSize: "25px" }}
                  className={isProcessing ? "animate-pulse" : ""}
                />
              ) : (
                <HeartOutlined
                  style={{ color: "white", fontSize: "25px" }}
                  className={isProcessing ? "animate-pulse" : ""}
                />
              )}
            </button>
            <button>
              <MessageCircle style={{ color: "white", fontSize: "25px" }} />
            </button>
          </div>
          <div>
            <p className="text-white">
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
