import { useInfiniteQuery } from "@tanstack/react-query";
import PostDataHelper from "../helper/api-to-post-data-converter.ts";
import { supabase } from "../supabaseClient.jsx";

const POSTS_PER_PAGE = 6;

const fetchFeedData = async (userId: string, pageParam: number = 0) => {
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
      return {
        posts: [],
        nextOffset: null,
      };
    }

    const followedIds = followedData.map((item) => item.followed_id);

    // Step 2: Fetch posts from followed users with pagination
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
      .range(pageParam, pageParam + POSTS_PER_PAGE - 1); // Use range for pagination

    if (postsError) {
      throw postsError;
    }

    if (!postsData) {
      return {
        posts: [],
        nextOffset: null,
      };
    }

    // Convert the posts data to match expected structure
    const formattedPosts = postsData.map((post) => ({
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

    // Return posts and next offset
    return {
      posts: convertedPosts,
      nextOffset:
        postsData.length === POSTS_PER_PAGE ? pageParam + POSTS_PER_PAGE : null, // null means no more pages
    };
  } catch (error) {
    console.error("Error fetching feed data:", error);
    throw error;
  }
};

export const useFetchFeed = (userId: string) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["feed", userId],
    queryFn: ({ pageParam }) => fetchFeedData(userId, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Flatten all pages into a single array of posts
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  // Function to load more posts
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Function to refresh feed (refetch from the beginning)
  const fetchFeed = () => {
    return refetch();
  };

  // Convert error to string format to match original hook
  const errorMessage = error instanceof Error ? error.message : null;

  return {
    fetchFeed, // Manual refetch function
    loadMore, // Function to load more posts
    posts, // Flattened array of all posts
    loading: isLoading || isRefetching,
    error: errorMessage,
    hasMore: hasNextPage ?? false,
    isFetchingNextPage, // Additional state to show loading indicator for pagination
  };
};
