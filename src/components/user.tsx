import React, { useState } from "react";
import { FOLLOW } from "../graphql/queries.tsx";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { UNFOLLOW } from "../graphql/queries.tsx";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { toast } from "sonner"

const followUser = async (followerId: string, followedId: string) => {
  const variables = {
    followerId,
    followedId,
  };
  const response = await fetchMutationGraphQL(FOLLOW, variables);
  return response;
};

const unfollowUser = async (followId: string) => {
  const variables = {
    followId,
  };
  const response = await fetchMutationGraphQL(UNFOLLOW, variables);
  return response;
};

interface UserSuggestion {
  name: string;
  userId: string;
  followedId: string;
  profilePicture: string;
  suggestion: boolean;
  followerCreatedId: string;
  tagName: string
}
const PostCard: React.FC<UserSuggestion> = ({
  name,
  userId,
  followedId,
  profilePicture,
  suggestion,
  followerCreatedId,
  tagName
}) => {
  const [followerCreated, setFollowerCreated] = useState(
    followerCreatedId ? followerCreatedId : ""
  );
  const [buttonClicked, setButtonClicked] = useState(suggestion);
  const [loader, setLoader] = useState(false);
  const handleFollow = async () => {
    try {
      setLoader(true);
      const response = await followUser(userId, followedId);
      if (response) {
        setFollowerCreated(
          response.insertIntofollowersCollection.records[0].id
        );
        setButtonClicked(false);
      }
    } catch {
      toast.error(`Failed to follow ${name}`);
      // alert("Failed to follow user.")
    } finally {
      setLoader(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoader(true);
      const response = await unfollowUser(followerCreated);
      if (response) {
        setFollowerCreated("");
        setButtonClicked(true);
      }
    } catch {
      toast.error(`Failed to unfollow ${name}`);
    } finally {
      setLoader(false);
    }
  };



  return (
    <>
      <div className="flex">
        <div>
          <img
            src={profilePicture}
            alt=""
            className="object-cover w-12 h-12 rounded-[50%]"
          />
        </div>
        <div className="ml-3 flex justify-between w-2/3">
          <div>
            <h2 className="text-white font-semibold">{name}</h2>
            <h2 className="text-gray-500 ">{tagName}</h2>
          </div>

          {loader ? (
            <button className="text-gray-300 flex items-center mt-2" disabled>
              <Spin indicator={<LoadingOutlined spin />} size="small" />
            </button>
          ) : buttonClicked ? (
            <button className="text-blue-600" onClick={handleFollow}>
              Follow
            </button>
          ) : (
            <button className="text-gray-300" onClick={handleUnfollow}>
              Following
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PostCard;
