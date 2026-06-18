import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import AdminApp from "./AdminApp";
import "./styles.css";

const queryClient = new QueryClient();
const RootApp = window.location.pathname.startsWith("/admin") ? AdminApp : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootApp />
    </QueryClientProvider>
  </StrictMode>,
);
