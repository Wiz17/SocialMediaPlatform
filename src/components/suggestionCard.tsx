import React from "react";
import { FOLLOW } from "../graphql/queries.tsx";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useUnfollow from "../hooks/useUnfollow.ts";

interface SuggestionCardProps {
  name: string;
  userId: string;
  followedId: string;
  photo: string;
  tagName: string;
}

const followUser = async (followerId: string, followedId: string) => {
  const variables = {
    followerId,
    followedId,
  };
  const response = await fetchMutationGraphQL(FOLLOW, variables);
  return response;
};

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  name,
  userId,
  followedId,
  photo,
  tagName,
}) => {
  const [buttonClicked, setButtonClicked] = useState(true);
  const [followLoader, setFollowLoader] = useState(false);
  const { error, loading: unfollowLoading, unfollowUser } = useUnfollow();

  // Handle unfollow errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error(`Failed to unfollow ${name}: ${error}`);
    }
  }, [error, name]);

  const handleFollow = async () => {
    try {
      setFollowLoader(true);
      const response = await followUser(userId, followedId);
      if (response) {
        setButtonClicked(false);
        toast.success(`Successfully followed ${name}`);
      }
    } catch (error) {
      toast.error(`Failed to follow ${name}`);
    } finally {
      setFollowLoader(false);
    }
  };

  const handleUnfollow = async () => {
    const response = await unfollowUser(userId, followedId);
    if (response) {
      setButtonClicked(true);
      toast.success(`Successfully unfollowed ${name}`);
    }
  };

  // Determine if any operation is loading
  const isLoading = followLoader || unfollowLoading;

  return (
    <div className="bg-zinc-800 rounded-lg w-[160px] flex-shrink-0 py-5">
      <img
        src={photo}
        alt={`${name}'s profile`}
        className="object-cover w-12 h-12 rounded-full mx-auto"
      />
      <div className="text-center text-gray-100 mt-2">{name}</div>
      <div className="text-gray-500 text-center">{tagName}</div>
      <div className="flex justify-center">
        {isLoading ? (
          <button className="text-gray-300 flex items-center" disabled>
            <span className="loader mr-2"></span>
            {unfollowLoading ? "Unfollowing..." : "Following..."}
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
            className="text-gray-300 hover:text-gray-400 transition-colors"
            onClick={handleUnfollow}
            disabled={isLoading}
          >
            Following
          </button>
        )}
      </div>
    </div>
  );
};

export default SuggestionCard;
