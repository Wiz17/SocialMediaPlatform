import { useState, useEffect } from "react";
import { fetchGraphQL } from '../graphql/fetcher.tsx'; // Your GraphQL fetch function
import { FETCH_FOLLOWED_USERS, FETCH_POSTS } from "../graphql/queries.tsx";

export const useFetchFeed = (userId: string) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      // Step 1: Fetch followed users
      const followedData = await fetchGraphQL(
        FETCH_FOLLOWED_USERS.replace("followerId", `"${userId}"`)
      );

      const followedIds = followedData.followersCollection.edges.map(
        (edge: any) => edge.node.followed_id
      );

      // Step 2: Fetch posts from followed users
      const postsData = await fetchGraphQL(
        FETCH_POSTS.replace("userIds", JSON.stringify(followedIds))
      );
      
      // Sort the posts by `created_at` in ascending order
      const sortedPosts = postsData.postsCollection.edges.sort(
        (a: any, b: any) => new Date(b.node.created_at).getTime() - new Date(a.node.created_at).getTime()
      );
      
      // Log the sorted nodes
      console.log(sortedPosts.map((edge: any) => edge.node));
      
      // Set the sorted nodes as posts
      setPosts(sortedPosts.map((edge: any) => edge.node));
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching posts.");
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [userId]);

  return { posts, loading, error };
};
