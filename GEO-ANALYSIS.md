# GEO-ANALYSIS.md — galeops.xyz
Generated: 2026-07-22 | Skill: seo-geo-claudeseo v2.2.4 (Google June 2026 AI Optimization Guide)
Live signals pulled from https://galeops.xyz (homepage 91KB HTML, sitemap 28 URLs, robots.txt, llms.txt)

## 1. GEO Readiness Score: 54/100
Strong structure + content, weak structured data + entity authority + freshness signals.

## 2. Platform Breakdown
| Surface | Score | Notes |
|---------|-------|-------|
| Google AI Overviews | 62/100 | Good heading hierarchy + FAQ; no schema; no dates |
| ChatGPT (web search) | 48/100 | Entity presence thin; no Wikipedia/Wikidata; Reddit/YouTube mentions unknown |
| Perplexity | 50/100 | Community-validation signals absent; no structured citations |

## 3. AI Crawler Access Status
- robots.txt: `User-agent: * / Allow: /` → covers all crawlers by default.
- GPTBot / OAI-SearchBot / ClaudeBot / PerplexityBot: NOT explicitly named (covered by `Allow: /`, but explicit allow is the GEO best practice).
- Recommendation: add explicit `Allow: /` blocks for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended.
- llms.txt: PRESENT (HTTP 200) — keep for non-Google AI crawlers (Google ignores it, per June 2026 guide).

## 4. llms.txt Status
PRESENT at /llms.txt (HTTP 200). Non-Google AI crawlers can use it. No action needed beyond keeping it current.

## 5. Brand Mention Analysis
- Wikipedia: UNKNOWN (likely absent) — high-impact gap for ChatGPT/Perplexity citation.
- Reddit: UNKNOWN — should build presence (Reddit = 46.7% of Perplexity citations).
- YouTube: GaleTech channel exists (rebrand June 2026) — leverage for YouTube mentions (strongest AI-visibility signal, ~0.737 correlation).
- LinkedIn: UNKNOWN.

## 6. Passage-Level Citability
- 11 H2 + 32 FAQ mentions → good passage structure.
- No `datePublished`/`dateModified` → staleness risk (pages >3 months old lose citation eligibility per SE Ranking 1.3M-citation study).
- No author Person schema → weak authority signals.

## 7. Server-Side Rendering Check
- Static HTML (Netlify, 91KB) → fully server-rendered. AI crawlers can read it. PASS.

## 8. Top 5 Highest-Impact Changes
1. **Add JSON-LD structured data** (Organization + Service + WebSite + Article on blog). ZERO today. Biggest single win.
2. **Add explicit AI-crawler Allow directives** in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
3. **Add datePublished/dateModified + author Person schema** to all pages/blog — fixes freshness + authority gaps.
4. **Build entity presence**: Wikipedia page for GaleOps/Matt Gale; YouTube mentions via GaleTech; Reddit AMAs in r/cybersecurity, r/LocalLLaMA.
5. **Create 3 dedicated service pages** (ai-security-audit, ai-guardrail-setup, ai-red-team) — currently 404. Needed for both SEO topical authority AND CRO message-match.

## 9. Schema Recommendations
- Organization (name, url, logo, sameAs: YouTube/LinkedIn/Twitter)
- Service (AI Security Audit $5K, AI Guardrail Setup $8K, AI Red Team & Compliance $12K) with offers/priceSpecification
- Person (Matt Gale — author byline, jobTitle, sameAs)
- WebSite + SearchAction

## 10. Content Reformatting Suggestions
- Front-load a 134-167 word self-contained definition block ("AI security audit is...") in first 60 words of ai-security.html.
- Add comparison table: Audit vs Guardrail vs Red Team (prices + scope).
- Add FAQ schema (not just visible FAQ) to capture zero-click/AEO.
