const SUPABASE_GRAPHQL_URL = process.env.REACT_APP_SUPABASE_URL; // Replace with your project URL
const API_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY; // Replace with your API key

/**
 * Generalized GraphQL Fetcher
 * @param {string} query - The GraphQL query or mutation string.
 * @param {Record<string, any>} variables - Variables to be passed with the GraphQL query.
 * @returns {Promise<any>} - The response data from the GraphQL API.
 */
export const fetchMutationGraphQL = async (
  query: string,
  variables?: Record<string, any>,
): Promise<any> => {
  try {
    const response = await fetch(SUPABASE_GRAPHQL_URL ?? "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY ?? "",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      throw new Error("GraphQL query failed");
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching GraphQL:", error);
    throw error;
  }
};
