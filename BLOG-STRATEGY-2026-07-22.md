# GaleOps Blog Strategy — Content Cluster Plan
**Generated**: 2026-07-22 | **Method**: DDG MCP keyword expansion (Firecrawl/DataForSEO dead) + existing blog inventory + competitor SERP scan
**Pillar**: AI Security Audit | **North star**: # of $5K+ AI security engagements closed/month

---

## Existing Blog Inventory (build on this)
- `ai-security-audit-guide.html` — "What Is an AI Security Audit? A Practical Guide" ✅ (pillar candidate)
- `ai-security-audit-thread.html` — X thread series
- `ai-security-audit-x.html` — X post series
- `vulnerabilities-thread.html` — 5 AI security vulnerabilities thread
- `tuesday-post.html` — "AI Agent Tool Access" (agentic/MCP angle!)
- `khan-academy-vdp-report.html` — VDP learning report

**Gap**: No dedicated posts for prompt injection deep-dive, LLM pentesting methodology, OWASP LLM Top 10 explainer, red teaming vs audit, or EU AI Act/NIST for SMBs. These are the high-volume spokes competitors rank for.

---

## Cluster Architecture (hub-and-spoke)

### Pillar (exists, needs upgrade)
**"What Is an AI Security Audit? A Practical Guide"** — expand to 2,500+ words, map to OWASP LLM Top 10, link to all spokes. Already has Article+Person schema.

### Spoke Cluster A — Attack Surface (informational, top-funnel)
| Spoke | Keyword | Template | Words | Status |
|--------|----------|----------|-------|--------|
| Prompt Injection: The #1 LLM Vulnerability (2026) | "prompt injection LLM" | explainer | 1,500 | 🆕 brief |
| LLM Penetration Testing: A 2026 Methodology | "LLM penetration testing" | how-to | 1,800 | 🆕 brief |
| 5 AI Security Vulnerabilities (expand existing thread) | "AI security vulnerabilities" | listicle | 1,500 | exists → improve |
| AI Agent Tool Access: When Tools Become Attack Surface | "AI agent tool access security" | explainer | 1,200 | exists (tuesday-post) → repurpose |

### Spoke Cluster B — Services (commercial, mid-funnel)
| Spoke | Keyword | Template | Words | Status |
|--------|----------|----------|-------|--------|
| AI Security Audit vs Red Team: What's the Difference? | "AI audit vs red team" | comparison | 1,400 | 🆕 brief |
| OWASP LLM Top 10 Explained for Business Owners | "OWASP LLM Top 10" | explainer | 1,600 | 🆕 brief |
| EU AI Act & NIST AI RMF for SMBs (2026) | "EU AI Act AI security" | guide | 1,500 | 🆕 brief |
| MCP Security: Auditing Agent↔Tool Handoffs | "MCP security audit" | how-to | 1,400 | 🆕 brief (red-team page backs this) |

### Spoke Cluster C — Competitor-intent (commercial)
| Spoke | Keyword | Template | Words | Status |
|--------|----------|----------|-------|--------|
| AI Security Web Alternative | "AI Security Web alternative" | comparison | 1,200 | ✅ LIVE (page) |
| Red AI Team Alternative | "Red AI Team alternative" | comparison | 1,200 | ✅ LIVE (page) |

---

## Internal Link Matrix
- Every spoke → pillar (mandatory)
- Pillar → every spoke (mandatory)
- Spoke↔spoke within cluster: 2-3 links
- Cross-cluster: 0-1 (only where genuinely relevant)
- Anchor text = target keyword, not "click here"

## Content Gaps GaleOps Can Own (competitors miss)
1. **Bug-bounty operator perspective** — we break real systems (Bugcrowd/OpenAI Safety Bounty); competitors are consultants. Every post should carry this credibility.
2. **The $149 snapshot / free /scan/** — a paid micro-deliverable + free tool competitors don't pair with long-form.
3. **SMB-focused compliance** — DeepAssure talks enterprise/gov; we translate EU AI Act/NIST for the 20-person company.
4. **MCP/agentic** — Zealynx owns narrative; we have the red-team offer to back it.

## Execution Order (do one by one)
1. **Upgrade pillar** (expand existing guide to 2,500w + OWASP map + spoke links)
2. **Spoke A-1: Prompt Injection explainer** (highest volume, competitors rank)
3. **Spoke B-2: OWASP LLM Top 10 explainer** (credibility play, pairs with audit page)
4. **Spoke B-3: EU AI Act/NIST for SMBs** (differentiation vs enterprise-only competitors)
5. **Spoke A-2: LLM Pentesting methodology** (challenges appscale/axveil)
6. Rest as time allows.

## Recommended Next
Generate the 3 content briefs (A-1, B-2, B-3) → write posts → interlink → add to sitemap → deploy.
