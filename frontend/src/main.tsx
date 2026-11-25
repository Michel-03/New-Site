import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { App } from "./App";
import { NotFoundPage } from "./components/NotFoundPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { AppToaster } from "./toaster";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element was not found.");
}

// There is no router library: the site is one page plus /privacy, and anything else is a 404.
const path = window.location.pathname;
const isHomePage = path === "/" || path === "/index.html";
const isPrivacyPage = /^\/privacy\/?$/.test(path);

createRoot(root).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      {isPrivacyPage ? (
        <PrivacyPage />
      ) : isHomePage ? (
        <>
          <App />
          <AppToaster />
        </>
      ) : (
        <NotFoundPage />
      )}
    </ChakraProvider>
  </StrictMode>,
);
