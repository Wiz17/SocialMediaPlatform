import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import PostDataHelper from "../helper/api-to-post-data-converter.ts";
import { supabase } from "../supabaseClient.jsx";

const fetchFeedData = async (userId: string, limit: number = 6) => {
  try {
    // Step 1: Fetch followed users
    const { data: followedData, error: followedError } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", userId);

    if (followedError) {
      throw followedError;
    }

    if (!followedData || followedData.length === 0) {
      return [];
    }

    const followedIds = followedData.map((item) => item.followed_id);

    // Step 2: Fetch posts from followed users with limit
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select(
        `
        id,
        content,
        image,
        created_at,
        likes,
        user_id,
        likes2 (
          like_id,
          user_id
        ),
        users (
          username,
          profile_picture,
          tag_name
        )
      `,
      )
      .in("user_id", followedIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (postsError) {
      throw postsError;
    }

    if (!postsData || postsData.length === 0) {
      return [];
    }

    // Convert the posts data to match expected structure
    const formattedPosts: any = postsData.map((post) => ({
      postId: post.id,
      content: post.content,
      image: post.image,
      created_at: post.created_at,
      likes: post.likes,
      user_id: post.user_id,
      likes2: post.likes2 || [],
      users: post.users,
    }));

    // Pass formatted posts to helper
    const convertedPosts = PostDataHelper(formattedPosts, userId);
    console.log(convertedPosts);

    return convertedPosts;
  } catch (error) {
    console.error("Error fetching feed data:", error);
    throw error;
  }
};

export const useFetchFeed = (userId: string) => {
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
    queryFn: () => fetchFeedData(userId, postsLimit),
    enabled: !!userId, // Only run when we have both userId and token
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
