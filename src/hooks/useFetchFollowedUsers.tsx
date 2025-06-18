import { useState, useEffect } from "react";
import { fetchGraphQL } from "../graphql/fetcher.tsx"; // Your GraphQL fetch function
import { FETCH_FOLLOWED_USERS, FETCH_POSTS, FETCH_ALL_USERS } from "../graphql/queries.tsx";

interface User {
  followedId: string;
  id: string;
  username: string;
  profile_picture: string;
  tag_name:string
}

export const useFetchFollowedUsers = (userId: string) => {
  const [users2, setUsers] = useState<User[]>([]); // Strongly typed users array
  const [loading5, setLoading] = useState<boolean>(true);
  const [error5, setError] = useState<string | null>(null);

  const fetchFollowedUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      // Step 1: Fetch followed users
      const followedData = await fetchGraphQL(
        FETCH_FOLLOWED_USERS.replace("followerId", `"${userId}"`)
      );
      const followedIds = followedData.followersCollection.edges.map((edge: any) => ({
        id: edge.node.id,
        followed_id: edge.node.followed_id,
      }));
      
    //   followedIds.push(userId); // Add current user to the list of followed IDs
       console.log(followedIds)
      // Step 2: Fetch all users
      const allUsers = await fetchGraphQL(FETCH_ALL_USERS);
      const users = allUsers.usersCollection.edges.map((edge: any) => edge.node);
      console.log(users)

      // Step 3: Filter users to exclude those in followedIds
      const followedUsers = users
      .filter((user: { id: any; }) =>
        followedIds.some((followed: { followed_id: any; }) => followed.followed_id == user.id)
      )
      .map((user: { id: any; }) => {
        const matchedFollowed = followedIds.find(
          (followed: { followed_id: any; }) => followed.followed_id === user.id
        );
        return {
          ...user,
          followedId: matchedFollowed?.id,
        };
      });

      
      console.log(followedUsers)
      setUsers(followedUsers); // Update state with unfollowed users
    } catch (err: any) {
      setError(err?.message || "An error occurred while fetching users.");
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  

  return { fetchFollowedUsers,users2, loading5, error5 };
};
