import React from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { LIKED_POSTS_HANDLE } from "../graphql/queries.tsx";
import { LIKE_HANDLER } from "../graphql/queries.tsx";
import { ADD_LIKE, REMOVE_LIKE } from "../graphql/queries/likes.ts";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { requestMaker } from "../graphql/requestMaker.ts";
import { supabase } from "../supabaseClient.jsx";

interface PostCardProps {
  id: string;
  name: string;
  userImg: string;
  content: string;
  timeAgo: string;
  postImg: string;
  tagName: string;
  likes: number;
  liked: boolean;
  // dataArr: string[];
  // dataArrSetState: React.Dispatch<React.SetStateAction<string[]>>;
}

// Define the component
const PostCard: React.FC<PostCardProps> = ({
  id,
  name,
  userImg,
  content,
  timeAgo,
  postImg,
  tagName,
  likes,
  liked,
  // dataArr,
  // dataArrSetState
}) => {
  const userId: string = localStorage.getItem("id") || "";
  const [likeBtn, setLikeBtn] = useState<boolean>(liked);
  const [likeCount, setLikeCount] = useState<number>(Number(likes) || 0); // Convert to number initially

  const disLikeHandle = async (id: string) => {
    setLikeBtn(false);
    const likeTemp = likeCount - 1; // Process as number
    setLikeCount(likeTemp);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const idToken = session?.access_token || "";
    console.log(idToken);

    try {
      await requestMaker(REMOVE_LIKE, idToken, {
        user_id: userId,
        post_id: id,
      }); // Pass as string
    } catch {
      toast.error("failed to dislike post.");
    }
  };

  const likeHandle = async (id: string) => {
    setLikeBtn(true);
    const likeTemp = likeCount + 1; // Process as number
    setLikeCount(likeTemp);
    // const temp = [...(dataArr || []), id];
    // dataArrSetState(temp);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const idToken = session?.access_token || "";
    console.log(idToken);

    try {
      // await fetchMutationGraphQL(ADD_LIKE, { user_id: userId, post_id: id }); // Pass as string
      await requestMaker(ADD_LIKE, idToken, { user_id: userId, post_id: id }); // Pass as string
    } catch {
      toast.error("Failed to like a post");
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
              <>
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
              </>
            </div>
          )}
          <div className="flex gap-3">
            {likeBtn ? (
              <HeartFilled
                style={{ color: "red", fontSize: "25px" }}
                onClick={() => disLikeHandle(id)}
              />
            ) : (
              <HeartOutlined
                style={{ color: "white", fontSize: "25px" }}
                onClick={() => likeHandle(id)}
              />
            )}
            {/* <div className="text-gray-50 ml-2">{likes}</div> */}
            <button>
              <MessageCircle style={{ color: "white", fontSize: "25px" }} />
            </button>
          </div>
          <div>
            <p className="text-white">{likeCount} Likes</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
