// Database user interface (what comes from Supabase)
//useFetchFollowedUsers hook
interface DatabaseUser {
  id: string;
  username: string;
  profile_picture: string;
  tag_name: string;
}

// Follower record from database
interface DatabaseFollowerRecord {
  id: string;
  created_at: string;
  follower_id: string;
  users: DatabaseUser;
}

// Transformed user interface (what we use in the component)
interface User {
  followersIdPk: string; // Fixed typo: follwersIdPk -> followersIdPk
  followed_id: string;
  username: string;
  profile_picture: string;
  tag_name: string;
}

interface UseFetchFollowedUsersReturn {
  fetchFollowedUsers: () => Promise<void>;
  users2: User[];
  loading5: boolean;
  error5: string | null;
}

export {
  DatabaseUser,
  DatabaseFollowerRecord,
  UseFetchFollowedUsersReturn,
  User,
};
