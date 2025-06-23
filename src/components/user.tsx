import React, { useState, useEffect } from "react";
import { FOLLOW } from "../graphql/queries.tsx";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { toast } from "sonner";
import useUnfollow from "../hooks/useUnfollow.ts";

const followUser = async (followerId: string, followedId: string) => {
  const variables = {
    followerId,
    followedId,
  };
  const response = await fetchMutationGraphQL(FOLLOW, variables);
  return response;
};

interface UserSuggestion {
  name: string;
  userId: string;
  followedId: string;
  profilePicture: string;
  suggestion: boolean;
  followerCreatedId: string;
  tagName: string;
}

const UserCard: React.FC<UserSuggestion> = ({
  name,
  userId,
  followedId,
  profilePicture,
  suggestion,
  tagName,
}) => {
  const [buttonClicked, setButtonClicked] = useState(suggestion);
  const [followLoading, setFollowLoading] = useState(false);
  const {
    error: unfollowError,
    loading: unfollowLoading,
    unfollowUser,
  } = useUnfollow();

  useEffect(() => {
    if (unfollowError) {
      toast.error(`Failed to unfollow ${name}: ${unfollowError}`);
    }
  }, [unfollowError, name]);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      const response = await followUser(userId, followedId);
      if (response) {
        setButtonClicked(false);
        toast.success(`Successfully followed ${name}`);

        // Dispatch event to remove user from suggestions
        const followEvent = new CustomEvent("userFollowed", {
          detail: { followedUserId: followedId },
        });
        window.dispatchEvent(followEvent);
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error(`Failed to follow ${name}`);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    const response = await unfollowUser(userId, followedId);
    if (response) {
      setButtonClicked(true);
      toast.success(`Successfully unfollowed ${name}`);

      // Dispatch event to add user back to suggestions
      const unfollowEvent = new CustomEvent("userUnfollowed", {
        detail: { unfollowedUserId: followedId },
      });
      window.dispatchEvent(unfollowEvent);
    }
  };

  // Determine if any loading is happening
  const isLoading = followLoading || unfollowLoading;

  return (
    <>
      <div className="flex">
        <div>
          <img
            src={profilePicture}
            alt={`${name}'s profile`}
            className="object-cover w-12 h-12 rounded-[50%]"
          />
        </div>
        <div className="ml-3 flex justify-between w-2/3">
          <div>
            <h2 className="text-white font-semibold">{name}</h2>
            <h2 className="text-gray-500">{tagName}</h2>
          </div>

          {isLoading ? (
            <button
              className="text-gray-300 flex items-center mt-2"
              disabled
              aria-label={followLoading ? "Following..." : "Unfollowing..."}
            >
              <Spin indicator={<LoadingOutlined spin />} size="small" />
              <span className="ml-2 text-sm">
                {followLoading ? "Following..." : "Unfollowing..."}
              </span>
            </button>
          ) : buttonClicked ? (
            <button
              className="text-blue-600 hover:text-blue-500 transition-colors"
              onClick={handleFollow}
              disabled={isLoading}
            >
              Follow
            </button>
          ) : (
            <button
              className="text-gray-300 hover:text-red-400 transition-colors"
              onClick={handleUnfollow}
              disabled={isLoading}
            >
              Following
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCard;
