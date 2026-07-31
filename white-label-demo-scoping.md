# White-Label Demo Environment — Scoping Doc

**Date:** June 9, 2026
**Author:** Jarvis (for Matt Gale)
**Status:** Draft v0.1 — ready for review

---

## 1. Purpose

Give agencies a working, branded demo of GaleOps AI agents so they can:
1. **Experience the product** before committing (reduces sales friction)
2. **Show their own clients** what AI agents will do for them (agencies use this as a sales tool)
3. **Onboard faster** — agencies who've used the demo close 3-5x faster

The demo is NOT a sandbox for agencies to build things. It's a polished, self-contained showcase that makes the value unmistakable.

---

## 2. Target Audience

| Persona | What they need from the demo |
|---------|------------------------------|
| **Agency owner / decision maker** | See proof the agents work. Understand the revenue opportunity for their agency. |
| **Agency account manager** | Be able to walk a client through what the AI agents will do, live. |
| **End client (agency's customer)** | If agency shares the demo link, the client should see a branded experience that builds trust. |

---

## 3. Demo Environment Architecture

```
┌─────────────────────────────────────────────────────┐
│                White-Label Demo Stack                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────┐   ┌──────────────┐                  │
│  │  Agency A    │   │  Agency B    │  ...            │
│  │  galeops.xyz │   │  galeops.xyz │                  │
│  │  /demo/a    │   │  /demo/b    │                  │
│  └──────┬───────┘   └──────┬───────┘                  │
│         │                   │                         │
│         └───────┬───────────┘                         │
│                 ▼                                      │
│  ┌──────────────────────────────────┐                 │
│  │        Demo Orchestrator         │                 │
│  │  - Loads agency branding config  │                 │
│  │  - Routes to typed demo pages    │                 │
│  │  - Tracks engagement (opt-in)    │                 │
│  └──────────────┬───────────────────┘                 │
│                 │                                      │
│         ┌───────┴───────┐                             │
│         ▼               ▼                              │
│  ┌────────────┐  ┌────────────┐                      │
│  │ Lead Gen   │  │  Agent     │                      │
│  │ Demo       │  │  Workflow  │                      │
│  │            │  │  Demo      │                      │
│  └────────────┘  └────────────┘                      │
│                                                      │
│  Hosted on: galeops.xyz (Netlify) + FastAPI backend  │
│  Data: Demo data only, no real PII                   │
│  Auth: Optional email gate (agency's choice)         │
└─────────────────────────────────────────────────────┘
```

---

## 4. Demo Scenarios (Priority Order)

### 4a. AI Lead Generation Demo (P0 — Ship First)

**What it shows:** How GaleOps AI finds, qualifies, and drafts outreach for leads.

**User flow:**
1. Visitor lands on `/demo/[agency-slug]`
2. Sees agency-branded landing card: "See how [Agency Name] generates qualified leads with AI"
3. Clicks "Run Demo"
4. Presents a simple form: "Tell us about your ideal customer" (industry, company size, role)
5. After submitting, the demo runs a simulated lead generation:
   - Spinner with status: "Scanning companies... Qualifying leads... Writing outreach..."
   - After ~15 seconds, displays 3 sample leads with:
     - Company name, logo placeholder, industry
     - Contact name + title (realistic but fake data)
     - Fit score (1-10) with color coding
     - One-line research insight
     - Personalized email draft (expandable)
6. CTA at bottom: "Get leads like these delivered weekly. Talk to [Agency Name]."

**Technical implementation:**
- Pre-built dataset of 20-30 fictional but realistic companies per industry (5-6 industries covered)
- Email templates are pre-written with variable substitution (company name, contact name, pain point)
- No real AI API calls needed — deterministic output for demo speed and reliability
- Analytics: track form submissions, time on page, CTA clicks → send to agency dashboard

### 4b. AI Agent Workflow Demo (P0 — Ship with Lead Gen)

**What it shows:** A chat interface where you can watch an AI agent work.

**User flow:**
1. "Watch an AI agent handle a real task"
2. Scenario selector (choose one):
   - **Customer Support Triaging** — Incoming support emails get categorized, prioritized, and draft replies written
   - **Meeting Booking Flow** — A scheduling request gets processed through calendar checks, confirmation, and reminder
   - **Data Entry Automation** — Extracting info from a document and pushing it to a CRM
3. After selecting, shows a terminal-style animation:
   - Left panel: The incoming request (email, message, or document)
   - Right panel: Agent "thinking" steps with tool calls visible
   - Final output: The completed task result
4. Side panel shows: "What just happened" — a human-readable summary of the agent's decision chain
5. CTA: "Get this running in your business. Book a call with [Agency Name]."

**Technical implementation:**
- Pre-recorded "runs" — each scenario has 3-4 variants that rotate
- Can be purely frontend (no backend needed for demo)
- CSS animation for the terminal typing effect
- The "agent thinking" steps are from real production runs (sanitized)

### 4c. AI SEO Monitor Demo (P1 — Month 2)

**What it shows:** Automated SEO audit that every monthly client gets.

**User flow:**
1. "See what our automated SEO Monitor finds on your site"
2. Input field: Enter your website URL
3. Demo runs a simplified audit (uses Firecrawl skill on the real URL)
4. Shows a branded report card:
   - Overall SEO score (A-F)
   - Technical issues found (with severity)
   - Content gaps vs. top competitor
   - Top 5 prioritized fixes
5. CTA: "Get this report monthly + auto-monitoring. Included in every GaleOps plan."

**Technical implementation:**
- Real Firecrawl API call (costs ~$0.01 per audit, capped at 50/month for demos)
- Results cached per URL for 24 hours
- Agency branding on the report card
- Option to capture email for "full report delivered to your inbox"

### 4d. Agency Dashboard Preview (P1 — Month 2)

**What it shows:** What the agency sees when they manage clients.

**User flow:**
1. "Here's what your agency dashboard looks like"
2. A mock dashboard showing:
   - Client list (3-4 demo clients)
   - For each client: active agents, leads generated this month, time saved
   - Revenue estimate per client
3. Not interactive — high-fidelity mock or screenshot carousel
4. CTA: "Your dashboard, your branding, your pricing. Let's set it up."

---

## 5. Branding & Customization Config

Each agency gets a config block:

```yaml
# demo-configs/<agency-slug>.yaml
agency:
  name: "Acme Digital"
  logo_url: "https://..."           # Hosted logo
  primary_color: "#6366f1"         # Overrides default accent
  accent_color: "#818cf"
  domain: "demo.acmedigital.com"   # Optional custom domain (CNAME)

demo:
  lead_gen:
    enabled: true
    industries: ["saas", "ecommerce", "agency"]  # Limit to agency's focus
    lead_count: 3                  # How many leads per demo run
  agent_workflows:
    enabled: true
    scenarios: ["support", "scheduling"]  # Which scenarios to show
  seo_monitor:
    enabled: false                 # Month 2
  email_gate:
    enabled: false                 # If true, require email before showing results
  analytics:
    tracking_id: "UA-..."          # Agency's GA integration
```

**Stored in:** `~/galeops-site/demo-configs/` (YAML files)
**Admin UI:** Simple admin at `galeops.xyz/admin/demo-configs` (password-protected) for creating/editing configs.

---

## 6. Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| **Frontend** | Same site (Netlify), demo routes under `/demo/[slug]` | Free |
| **Backend** | FastAPI on existing Windows server (port 8080) | $0 (existing hardware) |
| **Demo Data** | YAML/JSON files + pre-built datasets | Free |
| **Lead Gen AI** | Pre-built datasets (Phase 1), Ollama local model (Phase 2) | $0 |
| **SEO Audit** | Firecrawl API (from existing account) | ~$0.01/query |
| **Analytics** | Simple SQLite tracking + optional GA passthrough | Free |
| **Auth (optional)** | Email gate with Mailgun/Sendgrid existing setup | $0 (existing) |
| **Custom domains** | Netlify DNS + agency configures CNAME | Free |

**New infrastructure needed:** None. Everything runs on what we already have.

---

## 7. Build Plan

### Phase 1: Core Demo (3-4 evenings)

| Task | Est. Time | What it delivers |
|------|-----------|-----------------|
| Lead gen demo frontend | 4h | Working `/demo/[slug]` with form + results display |
| Lead gen demo backend | 3h | Demo data for 5 industries, email template engine |
| Agent workflow demo frontend | 4h | Chat/terminal animation UI with 3 scenarios |
| Agency branding config system | 2h | YAML loader, CSS variable injection |
| Deploy + test | 1h | Live on galeops.xyz/demo/test |

### Phase 2: Agency Dashboard + SEO Demo (2-3 evenings)

| Task | Est. Time | What it delivers |
|------|-----------|-----------------|
| Dashboard mock/preview | 3h | High-fidelity agency dashboard mock |
| SEO audit integration | 3h | Real Firecrawl call → branded report card |
| Email gate capture | 1h | Optional email capture before showing results |
| Admin config UI | 2h | Password-protected config editor |

### Phase 3: Polish + Analytics (1-2 evenings)

| Task | Est. Time | What it delivers |
|------|-----------|-----------------|
| Analytics pipeline | 2h | Track demo views, form fills, CTA clicks |
| Custom domain support | 1h | CNAME setup docs for agencies |
| Mobile polish | 1h | Responsive demo on phones |
| Demo share links | 1h | Agency can share a unique demo URL |

---

## 8. Open Questions for Matt

1. **How many agencies do we target in Phase 1?** I'd suggest 3-5 pilot partners who get free/discounted access in exchange for feedback. Do you have agencies in mind from your network?

2. **Should the demo require an email gate or be open?** My recommendation: open access (no email gate) for Phase 1. Lower friction = more agencies try it. We can add email capture later for lead attribution. Your call.

3. **Custom domains or subpath?** I recommend `/demo/[agency-slug]` for Phase 1 (free, instant). Custom domains (demo.agency.com) in Phase 2 if agencies want them.

4. **Revenue model for white-label?**
   - Option A: $99-$299/mo per agency for the white-label demo (includes 50 demo runs/month)
   - Option B: Free for agencies on a retainer plan ($497+/mo), $199/mo standalone
   - My take: Option B. The demo is a sales tool that fills your retainer pipeline. Don't charge for the demo itself.

5. **Which agencies do you already know that would pilot this?** Even 2-3 warm intros would save weeks of cold outreach.

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Agency sees demo, doesn't see value | Use real-world scenarios with recognizable company names. "Oh, that's a real lead I could use" |
| Demo looks too "fake" | Use high-quality demo data. Real industries, realistic company names, real email formats |
| Too many requests on Firecrawl | Cache aggressively. 95%+ of demo runs hit the cache. Cap at 50/day per agency |
| Agency wants custom features Phase 1 | Firm roadmap: "That's Phase 2. Phase 1 gets you X, Y, Z." Don't scope creep |
| Netlify bandwidth limits | Static frontend = tiny bandwidth. Backend on our server. No real load concern |

---

## 10. Success Metrics

- **Demo starts:** Number of times the demo page loads
- **Demo completes:** Number of times someone runs through to the CTA
- **CTR to agency:** % who click "Book a call" or "Talk to [Agency]"
- **Agency to retainer conversion:** % of pilot agencies who sign within 30 days
- **PHASE 1 target:** 5 demo runs/day, 50% completion rate, 10% CTR to agency

---

*Draft v0.1 — Jarvis, June 9, 2026*
*Next: Review with Matt, then start Phase 1 build*

---

## 11. Phase 1 Build — Complete (June 10, 2026)

### What was built:
- **demo.html** — Full self-contained demo page at `/demo` and `/demo.html`
- **Lead Gen Demo** — Form with industry/role/size selects, "Generate Leads" button, 3 qualified leads with fit scores + email drafts
- **Agent Workflow Demo** — 3 scenarios with terminal-style animation (Support, Scheduling, Data Entry)
- **Demo Data** — 5 industries × 3 leads each = 15 pre-built leads with realistic data
- **Agency Config** — YAML-based branding config system
- **Deployed** — Live at galeops.xyz/demo