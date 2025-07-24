import { useState } from "react";
import { supabase } from "../supabaseClient.jsx"; // Import your Supabase client

export const useAddPost = () => {
  const [loading2, setLoading] = useState(false);
  const [error2, setError] = useState<string | null>(null);

  const addPost = async (userId: string, content: string, image: string) => {
    try {
      setLoading(true);
      setError(null);

      // Insert post into Supabase
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: userId,
          content: content,
          image: image,
          created_at: new Date().toISOString(),
        })
        .select(); // Returns the inserted record(s)

      if (error) {
        throw error;
      }

      return data; // Returns array of inserted posts
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addPost, loading2, error2 };
};
