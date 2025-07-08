import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient.jsx";
import { DatabaseUser } from "../types/home.js";

export const useFetchUnfollowedUsers = (userId: string) => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  // Function to fetch unfollowed users
  const fetchUnfollowedUsersData = async (page: number, limit: number) => {
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

    return allUsers || [];
  };

  // React Query hook
  const {
    data: queryData,
    isLoading: loading1,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["unfollowedUsers", userId, currentPage],
    queryFn: () => fetchUnfollowedUsersData(currentPage, 5),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Convert query error to string format
  const error1 = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "An unexpected error occurred."
    : null;

  // Main fetch function that maintains the original API
  const fetchUnfollowedUsers = useCallback(
    async (page = 0, limit = 5, append = false) => {
      try {
        if (append && page > 0) {
          // For load more functionality
          setCurrentPage(page);

          // Fetch data for the new page
          const newUsers = await fetchUnfollowedUsersData(page, limit);

          if (newUsers.length < limit) {
            setHasMore(false);
          }

          setUsers((prevUsers: DatabaseUser[]): DatabaseUser[] => {
            // Filter out duplicates
            const existingIds = prevUsers.map((user: DatabaseUser) => user.id);
            const filteredNewUsers = newUsers.filter(
              (user: DatabaseUser) => !existingIds.includes(user.id),
            );
            return [...prevUsers, ...filteredNewUsers];
          });
        } else {
          // For initial load or reset
          setCurrentPage(page);
          setHasMore(true);

          if (page === 0) {
            // Use React Query data for initial load
            if (queryData) {
              setUsers(queryData);
            } else {
              // Trigger refetch if no data
              const result = await refetch();
              if (result.data) {
                setUsers(result.data);
              }
            }
          } else {
            // Direct fetch for non-zero page without append
            const fetchedUsers = await fetchUnfollowedUsersData(page, limit);
            setUsers(fetchedUsers);

            if (fetchedUsers.length < limit) {
              setHasMore(false);
            }
          }
        }
      } catch (err: unknown) {
        // Error handling is managed by React Query for the main query
        // For additional fetches, we can handle errors here if needed
        console.error("Error in fetchUnfollowedUsers:", err);
      }
    },
    [userId, queryData, refetch],
  );

  // Load more function
  const loadMore = useCallback(
    async (page: number, limit = 5) => {
      if (hasMore) {
        await fetchUnfollowedUsers(page, limit, true);
      }
    },
    [fetchUnfollowedUsers, hasMore],
  );

  // Reset function
  const reset = useCallback(() => {
    setUsers([]);
    setCurrentPage(0);
    setHasMore(true);

    // Invalidate and refetch the query
    queryClient.invalidateQueries({ queryKey: ["unfollowedUsers", userId] });
  }, [userId, queryClient]);

  // Update users when React Query data changes (for initial load)
  useState(() => {
    if (queryData && currentPage === 0) {
      setUsers(queryData);
    }
  });

  return {
    fetchUnfollowedUsers,
    loadMore,
    reset,
    users,
    loading1,
    error1,
  };
};
