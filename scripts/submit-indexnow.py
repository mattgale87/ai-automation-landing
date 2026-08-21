"""Submit the galeops.xyz sitemap URLs to Bing/Yandex via IndexNow for fast indexing.

IndexNow lets Bing/Yandex/Naver/Seznam index new content immediately (Google
does NOT support IndexNow). The key file must be served at:
  https://galeops.xyz/<key>.txt

Usage:
  python scripts/submit-indexnow.py          # submit current sitemap URLs
"""
import json
import re
import time
import urllib.request
import urllib.error
from pathlib import Path

KEY = "1ca1069dbdc13b54d235deb9cd4c50c5"
HOST = "galeops.xyz"
ROOT = Path(r"C:/Users/matt/galeops-site")
INDEXNOW_URL = "https://api.indexnow.org/indexnow"

def main():
    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", sitemap)]
    # IndexNow accepts a subset; submit the key content pages first
    # (home, services, pricing, security pages, blog index) then the rest.
    priority = [u for u in urls if any(
        k in u for k in ["galeops.xyz/", "ai-security", "pricing", "services",
                         "case-studies", "blog/", "mcp-security-assessment",
                         "iso-42001-gap", "agentic-ops"]
    )]
    # dedupe, keep order, cap at 100 (IndexNow max per call is 10k, Bing likes small batches)
    ordered = []
    for u in priority + urls:
        if u not in ordered:
            ordered.append(u)
    batch = ordered[:100]

    payload = {"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": batch}
    req = urllib.request.Request(
        INDEXNOW_URL,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"IndexNow: {r.status} for {len(batch)} URLs")
    except urllib.error.HTTPError as e:
        print(f"IndexNow HTTP {e.code}: {e.read().decode()[:200]}")
    except Exception as e:
        print(f"IndexNow error: {e}")

    # Validate the key file is reachable
    try:
        k = urllib.request.urlopen(f"https://{HOST}/{KEY}.txt", timeout=20).read().decode().strip()
        print(f"Key file reachable: {'OK' if k == KEY else 'MISMATCH'}")
    except Exception as e:
        print(f"Key file check failed (needs deploy): {e}")

if __name__ == "__main__":
    main()
