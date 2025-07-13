import { PostData } from "../types/home.ts";

const PostDataHelper = (data: any[], userId: string) => {
  console.log(data[0]);
  console.log(data[0]?.likes2);
  console.log(data[0]?.users);

  const newData = data.map((post: any) => {
    return {
      content: post.content,
      created_at: post.created_at,
      id: post.postId || post.id,
      image: post.image,
      likes: post.likes2 ? post.likes2.length : 0,
      users: {
        tag_name: post.users?.tag_name || "",
        username: post.users?.username || "",
        profile_picture: post.users?.profile_picture || "",
      },
      liked: post.likes2
        ? post.likes2.some((like: any) => like.user_id === userId)
        : false,
    };
  });

  return newData;
};

export default PostDataHelper;
