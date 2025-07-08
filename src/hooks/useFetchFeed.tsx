import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FETCH_FOLLOWED_USERS, FETCH_POSTS } from "../graphql/queries.tsx";
import PostDataHelper from "../helper/api-to-post-data-converter.ts";
import { supabase } from "../supabaseClient.jsx";
import { requestMaker } from "../graphql/requestMaker.ts";
import { PostData } from "../types/home.ts";

// Separate function to fetch the feed data
const fetchFeedData = async (
  userId: string,
  idToken: string,
  limit: number = 6,
) => {
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

  // Step 2: Fetch posts from followed users with limit
  const postsData = await requestMaker(
    FETCH_POSTS.replace("userIds", JSON.stringify(followedIds)).replace(
      "limit",
      limit.toString(),
    ),
    idToken,
  );

  const isEmpty = postsData.postsCollection.edges.length === 0;
  console.log(postsData, isEmpty);

  if (isEmpty) {
    return [];
  }

  // Posts are already sorted by created_at DESC from the server
  // Convert and return the posts
  const convertedPosts = PostDataHelper(
    postsData.postsCollection.edges,
    userId,
  );
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
  // Initial limit of 6 posts, will be increased when loading more
  const [postsLimit, setPostsLimit] = useState<number>(6);
  // Store all posts - newest first (sorted by created_at DESC from the server)
  const [allPosts, setAllPosts] = useState<any[]>([]);
  // Track if there are more posts to load
  const [hasMore, setHasMore] = useState<boolean>(true);

  const {
    data: posts,
    isLoading: loading,
    error,
    refetch: refetchFeed,
    isRefetching,
  } = useQuery({
    queryKey: ["feed", userId, postsLimit], // Cache key - will cache per user and limit
    queryFn: () => fetchFeedData(userId, idToken, postsLimit),
    enabled: !!userId && !!idToken, // Only run when we have both userId and token
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Update allPosts when posts data changes
  useEffect(() => {
    if (posts) {
      setAllPosts(posts);
      // If we got fewer posts than requested, there are no more posts to load
      setHasMore(posts.length >= postsLimit);
    }
  }, [posts, postsLimit]);

  // Function to load more posts (older posts will be appended to the list)
  const loadMore = () => {
    setPostsLimit((prevLimit) => prevLimit + 6); // Increase limit by 6 to load older posts
  };

  // Function to refresh feed with current limit
  const fetchFeed = () => {
    return refetchFeed();
  };

  // Convert error to string format to match original hook
  const errorMessage = error instanceof Error ? error.message : null;

  return {
    fetchFeed, // Manual refetch function
    loadMore, // Function to load more posts
    posts: allPosts,
    loading: loading || isRefetching,
    error: errorMessage,
    hasMore, // Boolean indicating if there are more posts to load
  };
};
