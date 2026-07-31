# SCHEMA-REPORT.md — galeops.xyz
Generated: 2026-07-22 | Skill: seo-schema-claudeseo v2.2.4

## Detection
| Page | JSON-LD blocks found | Types |
|------|---------------------|-------|
| index.html | 3 | ProfessionalService, OfferCatalog (5 Offers w/ prices), FAQPage |
| ai-security.html | 3 | (same family) |

## Validation
| Schema | Type | Status | Issues |
|--------|------|--------|--------|
| Org/Service | ProfessionalService + OfferCatalog | ✅ | Prices present ($5K/$8K/$12K). Missing `sameAs` (YouTube/LinkedIn) for entity authority. |
| Offers | Offer | ✅ | price/priceCurrency valid. Good. |
| FAQPage | FAQPage | ⚠️ | Google RETIRED FAQ rich results for ALL sites on **2025-05-07**. Keep for users, but flag: no SERP benefit. Consider QAPage for genuine Q&A. |
| Person | — | ❌ | Missing author Person schema (Matt Gale) on blog + site. Hurts GEO authority signal. |
| Dates | — | ❌ | No `datePublished`/`dateModified` on blog posts. Staleness risk for AI citation. |
| WebSite | — | ❌ | Missing WebSite + SearchAction (minor). |
| BreadcrumbList | — | ❌ | Missing on nested pages (minor). |

## Generated enhancements (see generated-schema.json)
1. **Person** schema for Matt Gale (author, sameAs YouTube/LinkedIn) — add to site + blog.
2. **datePublished/dateModified** — add to all blog posts (required for GEO freshness).
3. **sameAs** array on Organization — YouTube @GaleTech, LinkedIn, X.
4. Keep FAQPage (user value) but don't rely on it for rich results.

## Notes
- Homepage already had strong schema — earlier GEO-ANALYSIS.md claim of "0 JSON-LD" was INCORRECT (regex miss). Corrected here.
- All existing JSON-LD is server-rendered (good — Google processes it normally).
