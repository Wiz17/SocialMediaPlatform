//useFetchFollowedUsers hook
interface DatabaseUser {
  id: string;
  username: string;
  profile_picture: string;
  tag_name: string;
}

interface DatabaseFollowerRecord {
  id: string;
  created_at: string;
  follower_id: string;
  users: DatabaseUser;
}

interface User {
  followersIdPk: string; // Fixed typo: follwersIdPk -> followersIdPk
  followed_id: string;
  username: string;
  profile_picture: string;
  tag_name: string;
}

interface UseFetchFollowedUsersReturn {
  fetchFollowedUsers: () => Promise<void>;
  users2: User[] | undefined;
  loading5: boolean;
  error5: string | null;
}

//useFetchFee hook

type PostData = {
  postId: any;
  node: {
    content: string;
    created_at: string;
    id: string;
    image: string;
    likes: number;
    likes2Collection: {
      edges: [
        {
          node: {
            user_id: string;
            like_id: string;
          };
        },
      ];
    };
    users: {
      profile_picture: string;
      tag_name: string;
      username: string;
    };
  };
};

export {
  DatabaseUser,
  DatabaseFollowerRecord,
  UseFetchFollowedUsersReturn,
  User,
  PostData,
};
