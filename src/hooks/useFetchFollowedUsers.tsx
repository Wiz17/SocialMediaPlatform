import { useState } from "react";
import { supabase } from "../supabaseClient.jsx";

interface User {
  follwersIdPk:string;
  followed_id: string;
  username: string;
  profile_picture: string;
  tag_name: string;
}

interface FollowerRecord {
  created_at: string;
  follower_id: string;
  users: User;
}

interface UseFetchFollowedUsersReturn {
  fetchFollowedUsers: () => Promise<void>;
  users2: User[];
  loading5: boolean;
  error5: string | null;
}

export const useFetchFollowedUsers = (userId: string): UseFetchFollowedUsersReturn => {
  const [users2, setUsers] = useState<User[]>([]); // Properly typed users array
  const [loading5, setLoading] = useState<boolean>(false); // Changed to false initially
  const [error5, setError] = useState<string | null>(null);

  const fetchFollowedUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch followed users
      const { data: followers, error } = await supabase
        .from('followers')
        .select(`
          id,
          created_at,
          follower_id,
          users!followers_followed_id_fkey (
            id,
            username,
            tag_name,
            profile_picture
          )
        `)
        .eq('follower_id', userId);

      console.log(followers);

      if (error) {
        setError(error.message);
        return;
      }

      // Type-safe mapping with null checks
      const fetchedFollowedUsersData: User[] = (followers || [])
        .filter((follower: any) => follower.users !== null)
        .map((follower: any) => ({
          follwersIdPk:follower.id,
          followed_id:follower.users.id,
          username:follower.users.username,
          tag_name:follower.users.tag_name,
          profile_picture:follower.users.profile_picture,
        }));

        console.log(fetchedFollowedUsersData)
      setUsers(fetchedFollowedUsersData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching users.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { fetchFollowedUsers, users2, loading5, error5 };
};