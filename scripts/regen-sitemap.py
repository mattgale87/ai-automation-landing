"""Regenerate galeops-site sitemap.xml from actual files + known redirects.

Fixes: (1) enforces ALL IGNORE entries (the old is_ignored() only checked a
subset), (2) prunes demo/test/404/thank-you/staging junk from the index,
(3) auto-dates TODAY instead of hardcoding a stale value.
"""
from pathlib import Path
from datetime import datetime
import re

ROOT = Path(r"C:/Users/matt/galeops-site")
BASE_URL = "https://galeops.xyz"
TODAY = datetime.now().strftime("%Y-%m-%d")

# Files/dirs to ignore (by directory part, exact filename, or name prefix)
IGNORE_DIRS = {
    "node_modules", ".netlify", ".git", "assets", "demo", "newsletter", "thanks",
    "BLOG-STRATEGY", "COMPETITIVE", "COPY", "CRO-AUDIT", "FREE-TOOL-SPEC",
    "GEO-ANALYSIS", "SCHEMA-REPORT", "TECHNICAL-SEO-AUDIT", "redesign",
    "outreach", "cluster-briefs", "video-script", "welcome-video",
}
IGNORE_BASES = {
    "banner.html", "metatest.html", "template.html", "leads.html",
    "sample-security-report.html", "galeops-counter.html",
    "ai-automation.html", "ai-security.html", "youtube-automation-composition.html",
    "redesign-full.html", "redesign-sample.html", "staging-hero-wordstagger.html",
    "404.html", "thank-you.html", "tuesday-post.html",
}
# Name PREFIXES that should never be indexed (demos, staging, scratch)
IGNORE_PREFIXES = ("demo-", "staging-", "redesign-", "thanks")
# Name SUFFIXES never indexed
IGNORE_SUFFIXES = (".md",)

# Known redirect paths from netlify.toml (clean URLs without matching files)
EXTRA = {
    "/security-audit/": TODAY,
    "/guardrail-setup/": TODAY,
    "/red-team/": TODAY,
    "/products/snapshot/": TODAY,
}


def is_ignored(rel_path: str) -> bool:
    parts = rel_path.split("/")
    base = parts[-1]
    if any(part in IGNORE_DIRS for part in parts):
        return True
    if base in IGNORE_BASES:
        return True
    if base.startswith(IGNORE_PREFIXES):
        return True
    if base.endswith(IGNORE_SUFFIXES):
        return True
    return False


paths: set[str] = set(EXTRA.keys())

for p in sorted(ROOT.rglob("index.html")):
    rel = p.relative_to(ROOT).as_posix()
    if is_ignored(rel):
        continue
    if rel == "index.html":
        paths.add("/")
    else:
        paths.add("/" + rel.replace("/index.html", "/"))

for p in sorted(ROOT.rglob("*.html")):
    rel = p.relative_to(ROOT).as_posix()
    if is_ignored(rel):
        continue
    if rel == "index.html" or rel.endswith("/index.html"):
        continue
    paths.add("/" + rel)

# drop any stragglers still ending in .md
paths = {p for p in paths if not p.endswith(".md")}

urlset = []
for path in sorted(paths):
    url = BASE_URL + path
    urlset.append(f"  <url><loc>{url}</loc><lastmod>{TODAY}</lastmod></url>")

sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(urlset) + "\n</urlset>\n"
(ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
print(f"Wrote {len(urlset)} URLs (from {TODAY})")
