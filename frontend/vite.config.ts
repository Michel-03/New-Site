import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { renderNotFoundHtml, renderOrganizationJsonLd, renderPrivacyHtml, renderStaticHtml } from "./src/staticHtml";

const STATIC_START = "<!--ba-static-->";
const STATIC_END = "<!--/ba-static-->";
const replaceStatic = (html: string, block: string) =>
  html.replace(new RegExp(`${STATIC_START}[\\s\\S]*${STATIC_END}`), () => `${STATIC_START}${block}${STATIC_END}`);
const setTitle = (html: string, title: string) => html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
const removeJsonLd = (html: string) => html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/, "");
const removeCanonical = (html: string) =>
  html.replace(/<link rel="canonical"[^>]*>\s*/, "").replace(/<meta property="og:url"[^>]*>\s*/, "");

/** The public address of the site, e.g. https://www.example.com. Set VITE_SITE_URL to enable it. */
function siteUrlFrom(value: string | undefined): string {
  return (value ?? "").trim().replace(/\/+$/, "");
}

function canonicalTags(siteUrl: string, path: string): string {
  if (!siteUrl) return "";
  const url = `${siteUrl}${path}`;
  return `    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n`;
}

function prerenderContent(siteUrl: string): Plugin {
  return {
    name: "byte-analytics-prerender",
    transformIndexHtml(html) {
      return html
        .replace('<div id="root"></div>', `<div id="root">${STATIC_START}${renderStaticHtml()}${STATIC_END}</div>`)
        .replace(
          "</head>",
          `${canonicalTags(siteUrl, "/")}    <script type="application/ld+json">${renderOrganizationJsonLd(siteUrl)}</script>\n  </head>`,
        );
    },
  };
}

// After the build, writes the extra files a static host needs:
// /privacy, a 404 page, robots.txt and (when the site address is known) sitemap.xml.
function emitSitePages(siteUrl: string): Plugin {
  let outDir = "";
  return {
    name: "byte-analytics-site-pages",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const source = resolve(outDir, "index.html");
      if (!existsSync(source)) return;
      const home = readFileSync(source, "utf8");

      const privacyPage = replaceStatic(removeJsonLd(setTitle(home, "Privacy notice | Byte Analytics")), renderPrivacyHtml())
        .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${siteUrl}/privacy" />`)
        .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${siteUrl}/privacy" />`);
      mkdirSync(resolve(outDir, "privacy"), { recursive: true });
      writeFileSync(resolve(outDir, "privacy", "index.html"), privacyPage);

      // Search engines should not index the error page.
      const notFoundPage = replaceStatic(removeCanonical(removeJsonLd(setTitle(home, "Page not found | Byte Analytics"))), renderNotFoundHtml()).replace(
        "</head>",
        '    <meta name="robots" content="noindex" />\n  </head>',
      );
      writeFileSync(resolve(outDir, "404.html"), notFoundPage);

      const robots = ["User-agent: *", "Allow: /", ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : [])].join("\n");
      writeFileSync(resolve(outDir, "robots.txt"), `${robots}\n`);

      if (siteUrl) {
        const urls = ["/", "/privacy"].map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join("\n");
        writeFileSync(
          resolve(outDir, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        );
      } else {
        console.warn("VITE_SITE_URL is not set, so sitemap.xml and canonical links were skipped.");
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // The shared .env sits in the repository root, one level above this folder.
  const env = loadEnv(mode, fileURLToPath(new URL("..", import.meta.url)), "VITE_");
  const siteUrl = siteUrlFrom(process.env.VITE_SITE_URL ?? env.VITE_SITE_URL);

  return {
    plugins: [react(), prerenderContent(siteUrl), emitSitePages(siteUrl)],
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
  };
});
