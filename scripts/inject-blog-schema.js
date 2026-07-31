// scripts/inject-blog-schema.js
// Injects Article + Person JSON-LD into blog HTML files (before </head>).
// Idempotent: skips files already containing the marker.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const blogDir = join("C:", "Users", "matt", "galeops-site", "blog");
const MARKER = "blog-person-schema-v1";

function extractMeta(html, prop) {
  const m = html.match(new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([^"']*)["']`, "i"));
  return m ? m[1] : "";
}
function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/\s*\|\s*GaleOps.*$/i, "").trim() : "";
}

let count = 0;
for (const file of await readdir(blogDir)) {
  if (!file.endsWith(".html") || file === "index.html" || file === "template.html") continue;
  const fpath = join(blogDir, file);
  const html = await readFile(fpath, "utf8");
  if (html.includes(MARKER)) continue;

  const title = extractTitle(html);
  const url = extractMeta(html, "og:url") || `https://galeops.xyz/blog/${file}`;
  const image = extractMeta(html, "og:image") || "https://galeops.xyz/og-image.svg";
  const desc = extractMeta(html, "og:description") || "";
  const today = new Date().toISOString().slice(0, 10);

  const schema = `  <!-- blog-person-schema-v1: Article + Person (Mathew Gale) for GEO -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(title)},
    "description": ${JSON.stringify(desc)},
    "url": ${JSON.stringify(url)},
    "image": ${JSON.stringify(image)},
    "datePublished": ${JSON.stringify(today)},
    "dateModified": ${JSON.stringify(today)},
    "author": {
      "@type": "Person",
      "name": "Mathew Gale",
      "jobTitle": "AI Security Consultant",
      "url": "https://galeops.xyz",
      "sameAs": [
        "https://www.youtube.com/@GaleTech",
        "https://www.linkedin.com/in/mattgale",
        "https://x.com/Mattjgale87"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "GaleOps",
      "url": "https://galeops.xyz",
      "sameAs": [
        "https://www.youtube.com/@GaleTech",
        "https://www.linkedin.com/in/mattgale",
        "https://x.com/Mattjgale87"
      ]
    }
  }
  </script>`;

  const idx = html.lastIndexOf("</head>");
  if (idx >= 0) {
    await writeFile(fpath, html.slice(0, idx) + schema + "\n" + html.slice(idx), "utf8");
    count++;
  }
}
console.log(`Blog Article+Person schema injected into ${count} file(s).`);