// scripts/inject-counter.js
// Injects the first-party counter snippet into every HTML file at build time.
// Idempotent: skips files that already contain the marker.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SNIPPET = `  <!-- GaleOps first-party counter -->
  <script src="/assets/galeops-counter.js" defer></script>`;
const MARKER = "galeops-counter.js";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".git", ".netlify"].includes(entry.name)) continue;
      yield* walk(full);
    } else if (entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

let count = 0;
for await (const file of walk(root)) {
  const html = await readFile(file, "utf8");
  if (html.includes(MARKER)) continue;
  const idx = html.lastIndexOf("</body>");
  const updated = idx >= 0
    ? html.slice(0, idx) + SNIPPET + "\n" + html.slice(idx)
    : html + SNIPPET + "\n";
  await writeFile(file, updated, "utf8");
  count++;
}
console.log(`Counter injected into ${count} HTML file(s).`);
