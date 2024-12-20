const SUPABASE_GRAPHQL_URL = "https://arxkebsmrbstwstaxbig.supabase.co/graphql/v1"; // Replace with your project URL
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeGtlYnNtcmJzdHdzdGF4YmlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEyNDkwNiwiZXhwIjoyMDQ4NzAwOTA2fQ.B5q-bi3Rz33jzgkz8QgGNQyKso3g2clpNxxc5Uu-_vk"; // Replace with your API key

export const fetchGraphQL = async (query: string) => {
  try {
    const response = await fetch(SUPABASE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();
    console.log(json)

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
