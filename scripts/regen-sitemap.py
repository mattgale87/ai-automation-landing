"""Regenerate galeops-site sitemap.xml from actual files + known redirects."""
from pathlib import Path
from datetime import datetime
import re

ROOT = Path(r"C:/Users/matt/galeops-site")
BASE_URL = "https://galeops.xyz"
TODAY = "2026-07-23"

# Files/dirs to ignore
IGNORE = {
    "node_modules", ".netlify", ".git", "assets", "demo", "banner.html",
    "metatest.html", "template.html", "BLOG-STRATEGY", "COMPETITIVE", "COPY",
    "CRO-AUDIT", "FREE-TOOL-SPEC", "GEO-ANALYSIS", "SCHEMA-REPORT",
    "TECHNICAL-SEO-AUDIT", "redesign", "demo-", "thanks", "leads.html",
    "sample-security-report.html", "video-script", "welcome-video", "tuesday-post",
    "stripe-payment-links.md", "lead-generation-playbook.md", "pricing.md",
    "outreach", "cluster-briefs", "content-calendar.md", "content-funnel-strategy.md",
    "nsf-sbir-project-pitch.md", "bugcrowd-submission.md", "CLAUDE_REDESIGN_PROMPT.md",
    "galeops-counter.html", "newsletter", "youtube-automation-composition",
    "redesign-full", "redesign-sample", "ai-automation", "ai-security.html",
},

# Known redirect paths from netlify.toml (clean URLs that don't have matching files)
EXTRA = {
    "/security-audit/": TODAY,
    "/guardrail-setup/": TODAY,
    "/red-team/": TODAY,
    "/products/snapshot/": TODAY,
}

def is_ignored(rel_path: str) -> bool:
    parts = rel_path.split("/")
    base = parts[-1]
    # ignore by directory part
    if any(part in IGNORE for part in parts):
        return True
    # ignore by filename suffix / prefix
    ignored_bases = {
        "ai-automation.html", "ai-security.html", "youtube-automation-composition.html",
        "redesign-full.html", "redesign-sample.html", "metatest.html", "template.html",
        "leads.html", "banner.html", "sample-security-report.html", "tuesday-post.html",
        "galeops-counter.html",
    }
    if base in ignored_bases:
        return True
    if base.endswith(".md"):
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

paths = {p for p in paths if not p.endswith(".md")}

# remove any .html for files that also have a directory version? keep both if they exist.
urlset = []
for path in sorted(paths):
    url = BASE_URL + path
    urlset.append(f"  <url><loc>{url}</loc><lastmod>{TODAY}</lastmod></url>")

sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + "\n".join(urlset) + "\n</urlset>\n"
(ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
print(f"Wrote {len(urlset)} URLs to {ROOT / 'sitemap.xml'}")
print("\n".join(urlset[:10]))
print("...")
print("\n".join(urlset[-5:]))
