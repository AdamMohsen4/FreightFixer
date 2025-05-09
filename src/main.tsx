import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./index.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider storageKey="vite-ui-theme">
        <App />
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
