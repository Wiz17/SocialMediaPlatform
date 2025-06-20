import { useState } from "react";
import { fetchGraphQL } from "../graphql/fetcher.tsx"; // Your GraphQL fetch function
import { FETCH_FOLLOWED_USERS,  FETCH_ALL_USERS } from "../graphql/queries.tsx";
import useFetchUsers from "./useFetchUsers.ts";

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
  const {fetchAllUsers} = useFetchUsers();


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
      
      // step 2 : get full data of followed users

      const filteredUserIds=followedIds.map((ids)=>ids.followed_id)

      const fetchedFollowedUsersData=await fetchAllUsers(filteredUserIds)

      setUsers(fetchedFollowedUsersData); // Update state with unfollowed users
    } catch (err: any) {
      setError(err?.message || "An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };
  return { fetchFollowedUsers,users2, loading5, error5 };
};
