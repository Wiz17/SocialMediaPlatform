import { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

const useUnfollow = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const unfollowUser = async (userId: string, followedId: string) => {
    try {
      setError(null);
      setLoading(true);
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", userId)
        .eq("followed_id", followedId);

      if (error) {
        console.error("Error unfollowing user:", error);
        setError("There is an error while unfollowing user");
        return { success: false };
      }

      return { success: true };
    } catch {
      setError("There is an error while unfollowing user");
      toast.error(`Failed to unfollow!`);
    } finally {
      setLoading(false);
    }
  };

  return { unfollowUser, loading, error };
};

export default useUnfollow;
