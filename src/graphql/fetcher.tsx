const SUPABASE_GRAPHQL_URL = process.env.REACT_APP_SUPABASE_URL; // Replace with your project URL
const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY; // Replace with your API key

export const fetchGraphQL = async (query: string) => {
  try {
    const response = await fetch(SUPABASE_GRAPHQL_URL ?? "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY ?? "",
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();
    console.log(json);

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
