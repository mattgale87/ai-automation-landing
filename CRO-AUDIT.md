# CRO AUDIT — galeops.xyz
Generated: 2026-07-22 | Skill: marketing-cro v2.0.0
Live signals: homepage 91KB, 21 CTA mentions, 0 on-site <form>/<input>, tier pages 404.

## Page Type
Homepage (cold-traffic consultancy landing) + service pages (ai-security.html, ai-automation.html).

## Primary Conversion Goal
Lead capture → consult call / $5K–$12K service engagement.

## CRO Readiness Score: 58/100
Clear value prop + strong CTA language, but NO dedicated service pages, NO on-site form capture, weak trust/social-proof.

---

## Quick Wins (Implement Now)
1. **Fix the 3 broken service URLs** — `/ai-security-audit`, `/ai-guardrail-setup`, `/ai-red-team` return 404. Either build the pages or 301-redirect to existing `/ai-security.html`. (Currently a visitor from an ad/blog CTA hits a dead page.)
2. **Add on-site lead form** — homepage has 0 `<form>`. All conversion routes through an external `/leads` redirect to galetech-hub. Add a native email/consult form (email-only, minimal fields) to capture without leaving the domain.
3. **Add dates + author byline** to blog posts (also a GEO win).

## High-Impact Changes (Prioritize)
1. **Build 3 dedicated service landing pages** (message-match for each $ tier):
   - AI Security Audit ($5K) — scope, deliverables, "get report"
   - AI Guardrail Setup ($8K) — what gets wired, timeframe
   - AI Red Team & Compliance ($12K) — methodology, compliance mapping (EU AI Act, NIST)
   Each with one clear CTA + schema. This is the single biggest CRO + SEO lever.
2. **Trust signals** — testimonials/case studies with real numbers. Currently none visible on homepage. Add 1-2 attributed client outcomes (or a "why GaleOps" proof block).
3. **Pricing clarity** — `/pricing.md` exists in sitemap but is a .md file (may render raw). Convert to styled HTML pricing page with a recommended-plan indicator + FAQ.

## Test Ideas (A/B)
- Hero headline: outcome-focused ("Get an AI Security Audit that finds what your red team missed") vs current.
- CTA copy: "Book a consult" vs "Get my AI risk report".
- Single-CTA landing pages per service vs homepage-with-nav.

## Copy Alternatives
- Headline A: "AI Security & Automation, audited before you ship."
- Headline B: "We break your AI so attackers can't. Audits, guardrails, red team."
- CTA: "Start with a $5K audit →" (anchors the lowest tier, natural upsell to $8K/$12K).

## Friction Points Found
- No on-site form → every lead leaves the domain to galetech-hub (drop-off risk).
- 3 dead service URLs in nav/CTA → broken journey.
- `/pricing.md` raw markdown → unprofessional if linked.

## Related Skills to Run Next
- marketing-free-tools → spec the AI-security scanner widget (free tool → leads).
- marketing-pricing → pricing page strategy.
- seo-schema-claudeseo → generate the JSON-LD to add.
