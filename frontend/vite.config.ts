import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { renderOrganizationJsonLd, renderStaticHtml } from "./src/staticHtml";

function prerenderContent(): Plugin {
  return {
    name: "byte-analytics-prerender",
    transformIndexHtml(html) {
      return html
        .replace('<div id="root"></div>', `<div id="root">${renderStaticHtml()}</div>`)
        .replace(
          "</head>",
          `    <script type="application/ld+json">${renderOrganizationJsonLd()}</script>\n  </head>`,
        );
    },
  };
}

export default defineConfig({
  plugins: [react(), prerenderContent()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
