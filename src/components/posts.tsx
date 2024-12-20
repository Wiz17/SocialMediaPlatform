import React from "react";
import {HeartOutlined , HeartFilled} from '@ant-design/icons'
import { useState,useEffect } from "react";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { LIKED_POSTS_HANDLE } from "../graphql/queries.tsx";
import { LIKE_HANDLER} from "../graphql/queries.tsx";


interface PostCardProps {
  id:string;
  name: string;
  userImg:string
  content: string;
  timeAgo: string;
  postImg: string;
  tagName:string;
  likes:number;
  dataArr:string[];
  dataArrSetState: React.Dispatch<React.SetStateAction<string[]>>; 
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
  dataArr,
  dataArrSetState
}) => {

  const userId: string = localStorage.getItem("id") || "";
  const [likeBtn ,setLikeBtn] = useState<boolean>(dataArr?.includes(id));
  const [likeCount, setLikeCount] = useState<number>(Number(likes) || 0); // Convert to number initially

const disLikeHandle = async (id: string) => {
    setLikeBtn(false);
    const likeTemp = likeCount - 1; // Process as number
    setLikeCount(likeTemp);
    const temp = dataArr.filter((dataPostId) => dataPostId !== id);
    dataArrSetState(temp);

    await fetchMutationGraphQL(LIKED_POSTS_HANDLE, { userId, postIds: temp });
    await fetchMutationGraphQL(LIKE_HANDLER, { postId: id, postLikes: String(likeTemp) }); // Pass as string
};

const likeHandle = async (id: string) => {
    setLikeBtn(true);
    const likeTemp = likeCount + 1; // Process as number
    setLikeCount(likeTemp);
    const temp = [...(dataArr || []), id];
    dataArrSetState(temp);

    await fetchMutationGraphQL(LIKED_POSTS_HANDLE, { userId, postIds: temp });
    await fetchMutationGraphQL(LIKE_HANDLER, { postId: id, postLikes: String(likeTemp) }); // Pass as string
};


  return (
    <>
      <div className="flex w-full">
        <div className="w-1/10 min-w-[50px]">
          <img
            src={userImg}
            alt=""
            className="object-cover w-12 h-12 rounded-[50%]"
          />
        </div>
        <div className="ml-3 w-9/10">
          <div className="flex items-center">
            <h1 className="text-white font-bold text-lg">{name}</h1>
            <span className="text-gray-500 ml-1">{tagName}</span>
            <p className="text-gray-500 ml-3">{timeAgo}</p>
          </div>
          <p className="text-white">{content}</p>
          {postImg && (
            <img
              src={postImg}
              alt="Post"
              className="w-[400px] object-cover rounded-lg mt-3"
            />
          )}
          <div className="flex mt-3">

          {likeBtn?<HeartFilled style={{color:'red',fontSize:'25px'}} onClick={()=>disLikeHandle(id)}/>:
          <HeartOutlined style={{color:'white',fontSize:'25px'}} onClick={()=>likeHandle(id)}/>}
          <div className="text-gray-50 ml-2">{likeCount}</div>
          </div>

        </div>
      </div>
      <div className="h-[0.5px] bg-gray-700 w-full mx-auto my-4"></div>
    </>
  );
};

export default PostCard;
