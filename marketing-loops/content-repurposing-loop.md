# GaleOps Weekly Content-Repurposing Loop

Adapted from `marketing-loops` → `references/loop-catalog.md` → "The content-repurposing loop".

## Anatomy (all 9 parts filled)

| Part | Definition |
|------|-------------|
| **Check cadence** | Weekly — Monday 14:00 (after the X Content Pipeline sibling fires its research) |
| **Acts when** | A new GaleOps video asset exists that hasn't been repurposed yet (newest `galeops-*.mp4` in `assets/videos/` or `C:\Users\matt\Desktop\` with an mtime newer than the last-run marker) |
| **Purpose** | Turn each long-form video into a week of channel-native content (X thread, LinkedIn post, YouTube Short description) so the videos we produce keep circulating — without manual rewriting |
| **Skills used** | `copywriting`, `social-media/*-poster` (draft only), `marketing-loops` (this loop) |
| **Loop body** | 1. Find newest un-repured video asset. 2. Extract 3–5 strongest ideas (hook, threat, fix, tiers, CTA). 3. Draft channel-native versions: X thread (1 main + 2-3 replies, no emojis in main text, CTA → galeops.xyz), LinkedIn post (professional framing, same CTA), YouTube Short description (if uploading). 4. Stage all as `pending_review` drafts — NEVER auto-post. |
| **Self-check** | Does each piece stand alone (not a link-dump that needs the original open)? Is the CTA present and correct (galeops.xyz / specific tier page)? No fabricated stats/testimonials? |
| **State / idempotency** | `last_repured_asset` marker in `x-drafts-pending.json` `meta`. Track asset filename + mtime. Never re-process an asset already handled. Dedupe drafted topics by keyword fingerprint. |
| **Stop / bail-out** | No new asset since last run → log "no action" + Telegram note. Error → report, don't loop forever. Human must approve + post from `x-drafts-pending.json`. |
| **Output** | New `pending_review` entries in `x-drafts-pending.json` (not `x-approved.json` — auto-poster reads approved[] only, and these need Matt's sign-off first) + Telegram summary naming the asset + count of drafts staged. |

## Guardrails (from loop-guardrails.md)
- **Auto-draft only, never auto-publish.** Writes to `x-drafts-pending.json` as `pending_review`. The X auto-poster's empty-queue short-circuit wins — it will NOT post from drafts.
- **FTC disclosure** for any incentivized content — none here, but if a draft ever mentions an affiliate, add the required disclosure.
- **Kill switch**: Matt can disable the cron any time. Loop reports honestly even on skip days.

## Notes
- The 5 GaleOps videos (4 funnel + 1 social teaser) are the seed assets. This loop keeps them in rotation: each week it can re-cut an angle (e.g. "prompt injection week" uses the audit video; "red team week" uses the red-team video).
- Companion: the X Content Pipeline cron (`6ed733b3f3c4`, weekdays 08:00) does RESEARCH + appends its own drafts. This loop is the DISTRIBUTION counterpart — it turns finished video assets into post-ready copy. They don't conflict (different inputs: pipeline = trends, this = video assets).
