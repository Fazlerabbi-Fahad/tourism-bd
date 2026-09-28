import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>
);
