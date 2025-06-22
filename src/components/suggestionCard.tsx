import React from "react";
import { FOLLOW } from "../graphql/queries.tsx";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { UNFOLLOW } from "../graphql/queries.tsx";
import { useState } from "react";
import { toast } from "sonner";
interface SuggestionCardProps {
  name: string;
  userId: string,
  followedId: string,
  photo: string;
  tagName: string
}

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


const SuggestionCard: React.FC<SuggestionCardProps> = ({ name, userId, followedId, photo, tagName }) => {
  
  const [buttonClicked, setButtonClicked] = useState(true);
  const [loader, setLoader] = useState(false);
  const handleFollow = async () => {
    try {
      setLoader(true);
      const response = await followUser(userId, followedId);
      if (response) {
        // setFollowerCreated(
        //   response.insertIntofollowersCollection.records[0].id
        // );
        setButtonClicked(false);
      }
    } catch (error) {
      toast.error(`Failed to follow ${name}`);
    } finally {
      setLoader(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoader(true);

      const response = await unfollowUser(followedId);
      if (response) {
        // setFollowerCreated("");
        setButtonClicked(true);
      }
    } catch (error) {
      toast.error(`Failed to unfollow ${name}`);
    } finally {
      setLoader(false);
    }
  };
  return (
    <>
      <div className="bg-zinc-800 rounded-lg w-[160px] flex-shrink-0 py-5">
        <img
          src={photo}
          alt=""
          className="object-cover w-12 h-12 rounded-full mx-auto"
        />
        <div className="text-center text-gray-100 mt-2">{name}</div>
        <div className="text-gray-500 text-center">{tagName}</div>
        <div className="flex justify-center">
          {loader ? (
            <button className="text-gray-300 flex items-center" disabled>
              <span className="loader mr-2"></span>{" "}
              {/* Replace with actual loader */}
              Loading...
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

export default SuggestionCard;
