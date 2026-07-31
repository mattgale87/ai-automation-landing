# GaleOps 3D Redesign Brief

## Task
Redesign the GaleOps homepage (`index.html`) to add stunning 3D animations and visual effects that "pop out" — while preserving ALL existing content, links, SEO, and conversion elements.

## Current State
- File: `C:/Users/matt/galeops-site/index.html` (~83KB, 1627 lines)
- Stack: Static HTML, no build step, CDN-loaded libraries
- Already loaded via CDN: Three.js, GSAP (3.12.5), Lenis (1.1.13)
- Design tokens already in `:root` CSS custom properties (see below)

## Design Tokens (already in CSS)
```
--bg-abyss: #08090a
--bg-surface: #101012
--bg-elevated: #191a1b
--accent: #6366f1 (indigo)
--accent-hover: #818cf8
--gold-accent: #c89a45
--gold-glow: rgba(200,154,69,0.18)
--green: #10b981
--text-primary: #f7f8f8
--text-secondary: #d0d6e0
--text-tertiary: #8a8f98
--font-display: 'DM Sans'
--font-numeral: 'Bitcount Grid Single'
--max-w: 1120px
```

## What to Build

### 1. Three.js Hero Particle Scene
- Replace the current hero background with a **Three.js particle system**
- Thousands of GPU-accelerated particles forming a rotating sphere/torus shape
- Particles react to mouse movement with inertia (subtle parallax)
- Bloom/glow effect using additive blending
- Colors: blend indigo (#6366f1) and gold (#c89a45) particles on dark abyss background
- Performance: cap particle count to ~8,000 on desktop, ~3,000 on mobile
- Lazy-init: only start the WebGL scene when hero section is visible (IntersectionObserver)
- Respect `prefers-reduced-motion`: fall back to a static gradient background

### 2. GSAP Scroll-Triggered Animations
- Fade-in + slide-up for each section as it enters viewport (ScrollTrigger)
- Stagger animations for service cards (each card animates 100ms after previous)
- Parallax effect on the hero text as you scroll down
- Section headings animate in with a slight 3D rotateY

### 3. Glassmorphism Service Cards
- Service tier cards (Audit → Guardrails → Red Team) get glassmorphism styling
- `backdrop-filter: blur(12px)` + semi-transparent background
- Subtle border glow on hover (gold accent)
- 3D tilt effect on hover (rotateX/rotateY based on mouse position over card)

### 4. Interactive CTA Elements
- Magnetic cursor effect on CTA buttons (button subtly pulls toward cursor when nearby)
- Gold border-glow pulse animation on primary CTA
- Smooth hover transitions

### 5. Animated SVG Network Pathways
- Connect the three service tiers (Audit → Guardrails → Red Team) with animated SVG lines
- Dashed lines that animate (flow) using stroke-dashoffset
- Particles travel along the path to show the funnel flow

## Critical Guardrails — DO NOT TOUCH

### Links that MUST survive (count and verify after):
- **10 Calendly links** — all `calendly.com` URLs must remain intact
- **3 Stripe payment links** — all `stripe.com` URLs must remain intact
- **2 mailto links** — all `mailto:` hrefs must remain intact
- **All external links** to galetech-hub.netlify.app must remain

### SEO elements that MUST survive:
- All `<meta>` tags (description, OG tags, Twitter Card)
- All 3 `<script type="application/ld+json">` blocks (JSON-LD structured data)
- `<link rel="canonical">`
- `<title>` tag
- `robots.txt` and `sitemap.xml` references

### Content that MUST survive:
- The $149 Snapshot offer section
- The free prompt-test CTA
- Service tier descriptions ($5K Audit, $8K Guardrails, $12K Red Team)
- Trust signals (Bugcrowd, 12+ years enterprise IT, etc.)
- Newsletter signup form
- Footer links

## Performance Budget
- Total page weight: keep under 150KB (current is ~83KB)
- Three.js scene: cap at 8,000 particles desktop, 3,000 mobile
- Use `requestAnimationFrame` properly, cancel on section leave
- Lazy-load Three.js scene only when hero is visible
- Add `prefers-reduced-motion` media query fallback

## Verification Steps (do these after editing)
1. Count Calendly links: `grep -c "calendly" index.html` — must be 10
2. Count Stripe links: `grep -c "stripe" index.html` — must be 3
3. Count mailto links: `grep -c "mailto" index.html` — must be 2
4. Count JSON-LD blocks: `grep -c "application/ld+json" index.html` — must be 3
5. Check all `<script>` and `<style>` tags are balanced
6. Check file size is reasonable (should be 90-120KB)
7. Verify no broken image references (all `src` attributes point to real files)

## Output
Edit `index.html` in place. Do NOT create new files. Do NOT rename anything. After editing, run the verification steps and report the results.