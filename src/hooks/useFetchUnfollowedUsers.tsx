import { useState } from "react";
import { supabase } from "../supabaseClient.jsx";
import { DatabaseUser } from "../types/home.js";

export const useFetchUnfollowedUsers = (userId: string) => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading1, setLoading] = useState<boolean>(false);
  const [error1, setError] = useState<string | null>(null);

  const fetchUnfollowedUsers = async (page = 0, limit = 5, append = false) => {
    try {
      setError(null);
      setLoading(true);

      // First get the list of followed user IDs
      const { data: followedUsers, error: followedError } = await supabase
        .from("followers")
        .select("followed_id")
        .eq("follower_id", userId);

      if (followedError) {
        throw new Error(
          `Error fetching followed users: ${followedError.message}`,
        );
      }

      const followedIds =
        followedUsers?.map((f: { followed_id: string }) => f.followed_id) || [];

      // For pagination, we need to calculate offset based on the actual limit, not fetchLimit
      const offset = page * limit;

      // Get users with proper pagination
      let query = supabase
        .from("users")
        .select(
          `
          id,
          username,
          tag_name,
          profile_picture
        `,
        )
        .neq("id", userId) // Exclude current user
        .order("created_at", { ascending: false });

      // Only apply the NOT IN filter if there are followed users
      if (followedIds.length > 0) {
        query = query.not("id", "in", `(${followedIds.join(",")})`);
      }

      // Apply pagination
      const { data: allUsers, error: usersError } = await query.range(
        offset,
        offset + limit - 1,
      );

      if (usersError) {
        throw new Error(`Error fetching users: ${usersError.message}`);
      }

      const unfollowedUsers = allUsers || [];

      // Either append to existing users or replace them
      if (append && page > 0) {
        setUsers((prevUsers: DatabaseUser[]): DatabaseUser[] => {
          // Filter out duplicates
          const existingIds = prevUsers.map((user: DatabaseUser) => user.id);
          const newUsers = unfollowedUsers.filter(
            (user: DatabaseUser) => !existingIds.includes(user.id),
          );
          return [...prevUsers, ...newUsers];
        });
      } else {
        setUsers(unfollowedUsers);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred while fetching users.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (currentPage: number, limit = 5) => {
    await fetchUnfollowedUsers(currentPage, limit, true);
  };

  const reset = () => {
    setUsers([]);
    setError(null);
  };

  return {
    fetchUnfollowedUsers,
    loadMore,
    reset,
    users,
    loading1,
    error1,
  };
};
