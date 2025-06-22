import { useState } from "react";
import { ADD_POST } from "../graphql/queries.tsx";
import { fetchMutationGraphQL } from '../graphql/fetcherMutation.tsx'; // Your GraphQL fetch function

export const useAddPost = () => {
  const [loading2, setLoading] = useState(false); // Initialize as false
  const [error2, setError] = useState<string | null>(null);

  const addPost = async (userId: string, content: string, image: string) => {


    try {
      setLoading(true); // Set loading to true at the start of the operation
      setError(null); // Reset error state
      // Execute GraphQL mutation
      const data = await fetchMutationGraphQL(ADD_POST, { userId, content, image });

      // Assuming data doesn't need further processing
      return data.insertIntopostsCollection.records;
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false); // Always reset loading state at the end
    }
  };

  return { addPost, loading2, error2 };
};
