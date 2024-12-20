import { useState } from "react";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { NOTIFICATION } from "../graphql/queries.tsx";

export const useGenerateNotification = () => {
  const [loading4, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error4, setError] = useState(null);

  const generateNotification = async (names: any , taggedUser:any) => {
    setLoading(true);
    setError(null);
    try {
      const variables = { names , taggedUser}; // Pass the array dynamically
      const response = await fetchMutationGraphQL(NOTIFICATION, variables);
      setData(response);
      console.log("Mutation Success:", response);
      return response; // Return the response to the caller
    } catch (err) {
      console.error("Mutation Error:", err);
      setError(err.message || "Something went wrong");
      throw err; // Rethrow the error to allow the caller to handle it
    } finally {
      setLoading(false);
    }
  };

  return {
    generateNotification, // Function to call the mutation
    loading4, // Loading state
    data, // Mutation result
    error4, // Error state
  };
};


  