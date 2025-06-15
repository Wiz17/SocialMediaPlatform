// things need tobe implemented
// create query for adding data to likes2 table 
// when fetching data from table convert it to format with helper of count:number & liked:boolean.
import { useState, useEffect } from "react";
import { fetchGraphQL } from '../graphql/fetcher.tsx'; // Your GraphQL fetch function
import { FETCH_FOLLOWED_USERS, FETCH_POSTS } from "../graphql/queries.tsx";
import PostDataHelper from '../utils/api-to-post-data-converter.ts';

export type PostData = {
  node: {
    content: string,
    created_at: string,
    id: string,
    image: string,
    likes: number,
    likes2Collection: {
      edges: [{
        node: {
          user_id: string,
          like_id: string
        }
      }]
    }
    users: {
      profile_picture: string,
      tag_name: string,
      username: string,
    }
  }
}

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
      const sortedPosts: PostData[] = postsData.postsCollection.edges.sort(
        (a: any, b: any) => new Date(b.node.created_at).getTime() - new Date(a.node.created_at).getTime()
      );

      // Log the sorted nodes
      const convertedPosts = PostDataHelper(sortedPosts, userId)
      console.log(convertedPosts);

      // Set the sorted nodes as posts
      setPosts(convertedPosts);
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
