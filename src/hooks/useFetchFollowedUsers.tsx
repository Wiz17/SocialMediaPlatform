import { useState } from "react";
import { supabase } from "../supabaseClient.jsx";
import {
  UseFetchFollowedUsersReturn,
  User,
  DatabaseFollowerRecord,
} from "../types/home.js";
export const useFetchFollowedUsers = (
  userId: string,
): UseFetchFollowedUsersReturn => {
  const [users2, setUsers] = useState<User[]>([]);
  const [loading5, setLoading] = useState<boolean>(false);
  const [error5, setError] = useState<string | null>(null);

  const fetchFollowedUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Fetch followed users with proper typing
      const { data: followers, error } = await supabase
        .from("followers")
        .select(
          `
          id,
          created_at,
          follower_id,
          users!followers_followed_id_fkey (
            id,
            username,
            tag_name,
            profile_picture
          )
        `,
        )
        .eq("follower_id", userId);

      console.log(followers);

      if (error) {
        setError(error.message);
        return;
      }

      // Cast the data to our expected type
      const typedFollowers = followers as unknown as
        | DatabaseFollowerRecord[]
        | null;

      // Type-safe mapping with null checks
      const fetchedFollowedUsersData: User[] = (typedFollowers || [])
        .filter((follower: DatabaseFollowerRecord) => follower.users !== null)
        .map(
          (follower: DatabaseFollowerRecord): User => ({
            followersIdPk: follower.id, // Fixed typo
            followed_id: follower.users.id,
            username: follower.users.username,
            tag_name: follower.users.tag_name,
            profile_picture: follower.users.profile_picture,
          }),
        );

      console.log(fetchedFollowedUsersData);
      setUsers(fetchedFollowedUsersData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching users.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { fetchFollowedUsers, users2, loading5, error5 };
};
