# GaleTech Video Script — "How I Run a Fleet of AI Agents in Production"
**Channel:** GaleTech (@GaleTech)
**Format:** Faceless, dark AI/security console aesthetic (dark bg, cyan #39e8ff accents)
**Length target:** ~6-7 min
**Voice:** Matt Gale — direct, first-person, practical. Short sentences. Confident, not salesman.
**Purpose:** Establish "one of the 12%" credibility for the Agentic Ops service.

---

## OPEN (0:00-0:20)

On screen: terminal/console visual. Text types in.

> "I run a fleet of AI agents in production every day. Not a demo. Not a pilot. Real agents doing real work — writing code, sending emails, running security scans, posting content."
>
> "And here's the thing: 88% of agent projects never make it to production. Mine did."
>
> "I'm Mathew. I spent 14 years running enterprise IT — Wells Fargo, $80M portfolio, a 40-person engineering org. Now I run agents the same way. Here's what actually works."

---

## SECTION 1 — The 12% (0:20-1:20)

Console visual: stats appear one by one.

> "Most people buy agents the way they bought cloud in 2015. Spin it up, watch it work in a demo, roll it out. Then it breaks. Or it costs 30x what you planned. Or it does something you didn't authorize. So it dies."
>
> "88% of agent projects never reach production. The average failed one costs $340,000."
>
> "The 12% that make it? They don't treat agents like a feature. They treat them like infrastructure."
>
> "Same as a network. Same as a data center. Something you operate, not something you switch on."

---

## SECTION 2 — The three things nobody budgets for (1:20-3:00)

> "When you actually run agents, three things show up that never appear in the pilot."
>
> "One: cost. An agentic workflow burns 5 to 30 times more tokens than a chatbot. Because the model doesn't remember. It's told everything again, every call. Stanford measured it — 62% of your agent bill is just re-sending context the model already saw."
>
> "Two: reliability. Agents fail quietly. Not with a crash. They just do the wrong thing and move on. Nobody notices until it's been wrong for three weeks."
>
> "Three: runaway loops. A research agent without a stop condition keeps going all night. Spawns sub-agents, which spawn more. One guy at a big company burned $500 million in a month because there was no limit on Claude licenses."
>
> "These aren't model problems. They're operations problems. And operations is a skill, not a product."

---

## SECTION 3 — How I actually run mine (3:00-4:40)

Console: diagram of agents (Bumble, Fizz, Honey — the multi-agent workspace).

> "Here's what running a fleet looks like, day to day."
>
> "I use a multi-agent setup — agents with their own identities, their own keys, their own channels. Each one scoped to a job. One researches. One writes. One reviews. They talk to each other like a team, not like a giant prompt."
>
> "Every one of them is scoped. Least privilege. An agent that writes code doesn't get a send-email tool. An agent that posts content doesn't get database access. Same rule I used at Wells Fargo: only give it what it needs."
>
> "I watch the cost. Every run, I can see what it burned. If a loop starts, it dies. Budget ceilings are non-negotiable."
>
> "And I watch the output. Because agents fail quiet. If an agent posts something wrong, I want to know in minutes, not weeks. Fail loud, not quiet."
>
> "That's it. It's not magic. It's the same discipline I ran a 40-person engineering org with. Scoping. Observability. Incident response. Cost control."

---

## SECTION 4 — Why this matters for you (4:40-5:30)

> "If you've got agents in production, you're already living the cost and reliability problem. If you're about to roll them out, you're walking into a 5-30x cost surprise and an 88% failure rate."
>
> "The platform vendors will sell you the agents. Nobody sells you how to keep them running."
>
> "That gap — between buying agents and running them well — that's what I do now. It's called Agentic Ops."
>
> "I take over your agent fleet. Cost governance, so your bill stops bleeding. Reliability, so agents fail loud instead of failing quiet. Incident response, for when something goes wrong at 2am."

---

## CLOSE (5:30-6:30)

> "Here's the offer. Book a free Agent Cost Audit. 15 minutes. I look at your fleet and your LLM bill, and I tell you what you're wasting. Usually it's a lot."
>
> "Most companies are overpaying by 30% or more on agent spend and don't know it. Let me show you."
>
> "That's the link below. Book the audit. Let's get your agents running like infrastructure."
>
> "I'm Mathew. Thanks for watching."

---

## Production notes
- **Aesthetic:** dark background, cyan #39e8ff console accents, monospace text reveals, subtle scan-line/grid background.
- **Assets:** use a fake terminal showing cost figures, an agent-org diagram, the 62% / 5-30x / 88% / $500M stat callouts.
- **Narration:** TTS or Matt's voice, direct and calm, no hype.
- **CTA card at end:** galeops.xyz/agentic-ops + calendly link.
