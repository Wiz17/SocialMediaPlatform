import { supabase } from "../supabaseClient";

const useSupabaseQueryTester = (userId) => {
  const fetchPosts2 = async () => {
    const { data: feedPosts, error } = await supabase
      .from("posts")
      .select(
        `
            *,
            users!posts_user_id_fkey (
              id,
              username,
              tag_name,
              profile_picture
            )
          `,
      )
      .in(
        "user_id",
        (
          await supabase
            .from("followers")
            .select("followed_id")
            .eq("follower_id", userId)
        ).data?.map((f) => f.followed_id) || [],
      )
      .order("created_at", { ascending: false });

    console.log(feedPosts);
  };

  return fetchPosts2;
};

export default useSupabaseQueryTester;
