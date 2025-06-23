import { useState } from "react";
import { supabase } from "../supabaseClient.jsx";

export const useFetchUnfollowedUsers = (userId: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading1, setLoading] = useState<boolean>(false);
  const [error1, setError] = useState<string | null>(null);

  const fetchUnfollowedUsers = async (page = 0, limit = 5, append = false) => {
    try {
      setError(null);
      setLoading(true);
      const offset = page * limit;

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

      const followedIds = followedUsers?.map((f) => f.followed_id) || [];

      // Get all users with pagination
      const { data: allUsers, error: usersError } = await supabase
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
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (usersError) {
        throw new Error(`Error fetching users: ${usersError.message}`);
      }

      console.log(allUsers);
      // Filter out followed users on the client side
      const unfollowedUsers =
        allUsers?.filter((user) => !followedIds.includes(user.id)) || [];

      console.log("Unfollowed users:", unfollowedUsers);

      // Either append to existing users or replace them
      if (append && page > 0) {
        setUsers((prevUsers) => {
          // Filter out duplicates
          const existingIds = prevUsers.map((user) => user.id);
          const newUsers = unfollowedUsers.filter(
            (user) => !existingIds.includes(user.id),
          );
          return [...prevUsers, ...newUsers];
        });
      } else {
        setUsers(unfollowedUsers);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching users.");
      console.error("Error fetching unfollowed users:", err);
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
