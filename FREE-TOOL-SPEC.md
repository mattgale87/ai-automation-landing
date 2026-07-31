# FREE-TOOL-SPEC.md — GaleOps AI-Security Scanner Widget
Generated: 2026-07-22 | Skill: marketing-free-tools v2.0.0
Method: pain-point ideation → validation → MVP scope → scorecard.

## Business Context
- Core product: AI Security Audit ($5K), Guardrail Setup ($8K), Red Team & Compliance ($12K).
- Audience: SMBs + startups shipping AI agents/LLM apps. Fear prompt injection, data leakage, compliance (EU AI Act).
- Problem they Google: "is my AI safe?", "prompt injection test", "AI security audit checklist".

## Tool Concept: "AI Security Readiness Scanner"
A free, no-login web tool that asks 8-10 yes/no questions about the user's AI stack
(prompt handling, input sanitisation, agent tool access, PII exposure, monitoring)
and outputs:
  - A 0-100 **AI Security Readiness Score**
  - A prioritized risk list (prompt injection / data leakage / agent misuse)
  - A PDF/HTML **checklist** mapped to the 3 paid tiers
  - CTA: "Book the $5K audit to close these gaps"

## Type
**Analyzer / Grader** (matches "audit tool", "grader tool" triggers). Highest CRO fit.

## Validation
| Factor | Score (1-5) | Rationale |
|--------|-------------|-----------|
| Search demand | 4 | "AI security audit", "prompt injection test" rising; AI Act 2026 driving searches |
| Audience match to buyers | 5 | Self-selects orgs shipping AI = exactly the $5K-$12K buyer |
| Uniqueness vs existing | 3 | Generic "AI risk calculators" exist; differentiate with real red-team framing + compliance mapping |
| Natural path to product | 5 | Score gaps → "book the audit" is the obvious next step |
| Build feasibility | 5 | Pure client-side quiz + score; no backend needed for MVP (or use existing lead-capture fn) |
| Maintenance burden | 4 | Static; low upkeep (inverse scored) |
| Link-building potential | 4 | "Free AI security scanner" earns security-blog links |
| Share-worthiness | 4 | Score + badge shareable on LinkedIn/X |
| **TOTAL** | **34/40** | **STRONG candidate** (>25) |

## MVP Scope
1. 8-10 question quiz (radio: Yes/No/Partial)
2. Client-side scoring → 0-100 + tier mapping
3. Result page: risk list + "get the full audit" CTA
4. Lead capture: email → existing `/lead-capture` function (reuse!)
5. Optional: badge image ("My AI Security Score: 72/100")

## What to Skip Initially
Accounts, saved history, multi-language, fancy charts. Plain, fast, mobile-first.

## Lead Capture
Partially gated: show score immediately (reach), require email for the full PDF checklist (capture). Feeds same `lead-capture.js` already on the site.

## Build Plan
- New page: `/scan/` (already exists in sitemap as /scan — extend it!)
- Reuse: lead-capture.js function, site CSS vars (--gold-accent, --accent)
- Deploy: same Netlify push as the rest of the site.

## Next Step
Build the /scan/ quiz as a static HTML page + JS scorer, wire email to lead-capture, add to sitemap. Pairs with the on-site form just added to the homepage.
