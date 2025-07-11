// utils/testHelpers.ts
export const expireToken = () => {
  // Find the Supabase session key in localStorage
  const storageKey = Object.keys(localStorage).find(
    (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
  );

  if (storageKey) {
    const session = JSON.parse(localStorage.getItem(storageKey) || "{}");

    // Set expiry to past time
    session.expires_at = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    session.expires_in = -3600; // Negative expiry

    // Update the session with expired values
    localStorage.setItem(storageKey, JSON.stringify(session));

    // Trigger a re-render by dispatching storage event
    window.dispatchEvent(new Event("storage"));

    console.log("Token manually expired!");
  }
};
