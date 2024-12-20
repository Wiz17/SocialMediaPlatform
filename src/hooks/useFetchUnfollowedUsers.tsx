import { useState, useEffect } from "react";
import { fetchGraphQL } from '../graphql/fetcher.tsx'; // Your GraphQL fetch function
import { FETCH_FOLLOWED_USERS, FETCH_POSTS , FETCH_ALL_USERS} from "../graphql/queries.tsx";

export const useFetchUnfollowedUsers = (userId: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading1, setLoading] = useState<boolean>(true);
  const [error1, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      // Step 1: Fetch followed users
      const followedData = await fetchGraphQL(
        FETCH_FOLLOWED_USERS.replace("followerId", `"${userId}"`)
      );
      console.log(followedData)
      const followedIds = followedData.followersCollection.edges.map(
        (edge: any) => edge.node.followed_id
      );
      followedIds.push(userId)
      // Step 2: Fetch all users
      const allUsers = await fetchGraphQL(
        FETCH_ALL_USERS
      );

      const users = allUsers.usersCollection.edges.map((edge) => edge.node);

      // Step 3: Filter users to exclude those in followedIds
      const unfollowedIds = users.filter((user: { id: any; }) => !followedIds.includes(user.id));

   
    //console.log(unfollowedIds)

    setUsers(unfollowedIds) 
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching users.");
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [userId]);

  return { users, loading1, error1 };
};
