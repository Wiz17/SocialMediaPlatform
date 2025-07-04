import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient.jsx";
import {
  UseFetchFollowedUsersReturn,
  User,
  DatabaseFollowerRecord,
} from "../types/home.js";

// Separate function to fetch followed users data
const fetchFollowedUsersData = async (userId: string): Promise<User[]> => {
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

  if (error) {
    throw new Error(error.message);
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
        followersIdPk: follower.id,
        followed_id: follower.users.id,
        username: follower.users.username,
        tag_name: follower.users.tag_name,
        profile_picture: follower.users.profile_picture,
      }),
    );

  return fetchedFollowedUsersData;
};

export const useFetchFollowedUsers = (
  userId: string,
): UseFetchFollowedUsersReturn => {
  const {
    data: users2,
    isLoading: loading5,
    error,
    refetch: fetchFollowedUsers,
    isRefetching,
  } = useQuery({
    queryKey: ["followedUsers", userId],
    queryFn: () => fetchFollowedUsersData(userId),
    enabled: !!userId, // Only run when userId is available
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Convert error to string format to match original hook
  const error5 = error instanceof Error ? error.message : null;

  return {
    fetchFollowedUsers: fetchFollowedUsers as unknown as () => Promise<void>,
    users2,
    loading5: loading5 || isRefetching,
    error5,
  };
};
