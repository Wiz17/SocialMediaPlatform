const SUPABASE_GRAPHQL_URL = process.env.REACT_APP_SUPABASE_URL; // Replace with your project URL
const API_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY; // Replace with your API key

export const requestMaker = async (
  query: string,
  idToken?: string,
  variables?: Record<string, any>,
): Promise<any> => {
  console.log(idToken);
  try {
    const response = await fetch(SUPABASE_GRAPHQL_URL ?? "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY ?? "",
        Authorization: `Bearer ${idToken}`,
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
