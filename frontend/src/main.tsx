import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { App } from "./App";
import { AppToaster } from "./toaster";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
      <AppToaster />
    </ChakraProvider>
  </StrictMode>,
);
