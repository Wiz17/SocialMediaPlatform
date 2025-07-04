import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FETCH_FOLLOWED_USERS, FETCH_POSTS } from "../graphql/queries.tsx";
import PostDataHelper from "../helper/api-to-post-data-converter.ts";
import { supabase } from "../supabaseClient.jsx";
import { requestMaker } from "../graphql/requestMaker.ts";
import { PostData } from "../types/home.ts";

// Separate function to fetch the feed data
const fetchFeedData = async (userId: string, idToken: string) => {
  if (!idToken) {
    throw new Error("No authentication token available");
  }

  // Step 1: Fetch followed users
  const followedData = await requestMaker(
    FETCH_FOLLOWED_USERS.replace("followerId", `"${userId}"`),
    idToken,
  );

  const followedIds = followedData.followersCollection.edges.map(
    (edge: any) => edge.node.followed_id,
  );

  // Step 2: Fetch posts from followed users
  const postsData = await requestMaker(
    FETCH_POSTS.replace("userIds", JSON.stringify(followedIds)),
    idToken,
  );

  const isEmpty = postsData.postsCollection.edges.length === 0;
  console.log(postsData, isEmpty);

  if (isEmpty) {
    return [];
  }

  // Sort the posts by `created_at` in descending order
  const sortedPosts: PostData[] = postsData.postsCollection.edges.sort(
    (a: any, b: any) =>
      new Date(b.node.created_at).getTime() -
      new Date(a.node.created_at).getTime(),
  );

  // Convert and return the posts
  const convertedPosts = PostDataHelper(sortedPosts, userId);
  console.log(convertedPosts);

  return convertedPosts;
};

// Custom hook to get auth token
const useAuthToken = () => {
  const [idToken, setIdToken] = useState<string>("");

  useEffect(() => {
    const fetchAuthToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token || "";
      setIdToken(token);
    };

    fetchAuthToken();
  }, []);

  return idToken;
};

export const useFetchFeed = (userId: string) => {
  const idToken = useAuthToken();

  const {
    data: posts,
    isLoading: loading,
    error,
    refetch: fetchFeed,
    isRefetching,
  } = useQuery({
    queryKey: ["feed", userId], // Cache key - will cache per user
    queryFn: () => fetchFeedData(userId, idToken),
    enabled: !!userId && !!idToken, // Only run when we have both userId and token
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Convert error to string format to match original hook
  const errorMessage = error instanceof Error ? error.message : null;

  return {
    fetchFeed, // Manual refetch function
    posts,
    loading: loading || isRefetching,
    error: errorMessage,
  };
};
