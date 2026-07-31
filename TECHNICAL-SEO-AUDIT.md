# Technical SEO Audit — galeops.xyz (2026-07-22)

Re-run via `seo-technical-claudeseo` after changes.

## Score: 84/100 (up from structural gaps; was homepage-only sitemap)

| Category | Status | Score | Notes |
|----------|--------|-------|-------|
| Crawlability | ✅ pass | 95 | robots.txt allows AI crawlers (GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended) — GEO win. Sitemap present + referenced. |
| Indexability | ✅ pass | 90 | Canonical self-referencing on homepage. 3 new service pages now in sitemap. NOTE: sitemap was homepage-only + had dead dup pages (ai-security.html, guardrail-setup/, red-team/) — REGENERATED. |
| Security | ✅ pass | 100 | HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy all present. HTTPS enforced. |
| URL Structure | ✅ pass | 95 | Clean hyphenated URLs, 301 redirects for tier pages (from earlier CRO pass). No chains. |
| Mobile | ✅ pass | 90 | Responsive, viewport meta, no horizontal scroll. |
| Core Web Vitals | ⚠️ warn | 70 | No CrUX field data (low traffic — expected). Static/light site → Lighthouse lab proxy is green. Re-test after traffic grows. |
| Structured Data | ✅ pass | 95 | 3 JSON-LD blocks (ProfessionalService + OfferCatalog $5K/$8K/$12K + FAQPage) in raw HTML (not JS-injected — good per Dec 2025 JS-SEO guidance). Blog posts now have Article + Person (Mathew Gale). |
| JS Rendering | ✅ pass | 90 | Critical SEO elements (canonical, JSON-LD, title, meta) in server HTML. |
| IndexNow | ⚠️ warn | 50 | Not implemented (Bing/Yandex only — low priority for a B2B consultancy; Google ignores it). Optional. |

## Critical Issues (fixed this run)
1. **Sitemap missing 3 new service pages** → REGENERATED with /ai-security-audit/, /ai-guardrail-setup/, /ai-red-team/ + corrected lastmod (2026-07-22) + removed deprecated <priority> tags + deduped dead duplicate pages.

## High Priority (done earlier, carried)
- robots.txt AI-crawler allow (GEO)
- 301 tier redirects (were 404ing)

## Medium Priority (backlog)
- IndexNow (optional, low ROI)
- CWV field data (needs traffic)

## Low Priority
- None outstanding.
