import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routes from "./routes.tsx";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthDebug } from "./components/authDebug.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement, // Add type assertion for the root element
);

root.render(
  // <React.StrictMode>
  <>
    <QueryClientProvider client={queryClient}>
      <Routes />
      {/* <AuthDebug /> */}
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  </>,
  // </React.StrictMode>
);
