# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Naming note

The package/directory is `quiet-apartment` but the brand, GitHub repo (`masefish92/NoisyApartment`), and production domain are all **NoisyApartment** (noisyapartment.org). Same project, don't be thrown by the mismatch.

## Next.js version warning

`AGENTS.md` in the repo root flags this explicitly: this is Next.js 16, which has breaking changes vs. older training data (APIs, conventions, file structure). Check `node_modules/next/dist/docs/` for the current API before assuming a pattern from memory, and heed deprecation notices.

## Commands

```bash
npm run dev               # Turbopack dev server, http://localhost:3000
npm run build             # production build (also runs the TypeScript check)
npm run start             # serve a production build locally
npm run lint               # ESLint (eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit           # type-check only, no dedicated package.json script for this
npm run seo:audit          # crawls the LIVE deployed site + audits the repo, writes scripts/seo-audit/*.md
npm run seo:fix            # dry-run: prints reversible auto-fixes for repo-audit findings
npm run seo:fix:apply      # same, but actually writes the fixes
npm run schema:validate    # crawls the LIVE deployed site's sitemap, validates every JSON-LD block
npm run indexnow:ping      # crawls the LIVE sitemap, POSTs every URL to api.indexnow.org (Bing/Yandex)
```

There is no test suite in this repo. Verification has been done manually: `npm run build` (confirms static generation succeeds, including with zero markdown content), `npm run lint` / `tsc --noEmit`, and a temporary `npm install -D playwright` for headless-browser visual checks — uninstall it again afterward rather than leaving it as a permanent dependency.

`seo:audit`, `schema:validate`, and `indexnow:ping` all fetch `https://noisyapartment.org` over HTTP (via its sitemap), not the local dev server — they check/act on what's actually live, so run them after a deploy, not instead of `npm run build`. `indexnow:ping` also depends on the key file at `public/<key>.txt` matching the `INDEXNOW_KEY` constant in `scripts/indexnow-ping.mjs` — keep both in sync if the key is ever rotated.

## Architecture

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4.

### Styling / design tokens

Tailwind v4 is configured **CSS-first** — there is no `tailwind.config.js`. Every design token (colors, spacing scale, custom font sizes, font families) lives in the `@theme` block at the top of `src/app/globals.css`. To add or change a token, edit that file directly; utility classes like `bg-primary`, `text-headline-md`, `px-margin-desktop`, `py-section-gap` are generated from it. Custom font-size tokens use paired keys (`--text-name` plus `--text-name--line-height` / `--font-weight` / `--letter-spacing`). The two site fonts (Montserrat, Merriweather) are loaded via `next/font/google` in `src/app/layout.tsx` and exposed as CSS variables that the theme's `--font-headline-md` / `--font-body-md` etc. point to.

### Content system (the core architecture)

This site is an SEO content/affiliate site built around a pillar-page + topic-cluster model — not a CMS. Articles are flat markdown files in `content/articles/*.md`, loaded by `src/lib/content.ts` (gray-matter for frontmatter, a unified/remark/rehype pipeline for HTML + a table of contents extracted from rehype-slug-generated heading ids).

- The exact frontmatter schema is documented in `content/articles/README.md`: `title, slug, description, keyword, category, publishDate, updatedDate, author, featured, affiliateDisclosure, pillar`.
- Exactly one article should have `pillar: true` (slug `apartment-noise`). It's served at `/guides/apartment-noise` instead of `/blog/[slug]`, and auto-lists every other ("cluster") article grouped by category — this is what gives pillar↔cluster internal linking without hand-maintained links.
- `category` must match a slug defined in `src/lib/categories.ts`, the single source of truth for the taxonomy. Categories are split into three groups: `source` (by noise source), `room` (by room), and `resource` (cross-cutting legal/template/product-roundup content that isn't tied to one noise source or room). `/category/[category]` pages are statically generated for **every** entry in that list, including ones with zero articles (rendered as a "coming soon" empty state), so homepage nav links never 404 even before content exists.
- The article template (`src/app/blog/[slug]/page.tsx`) renders, in order: category breadcrumb, byline (author name links to `/about`) with publish/updated dates, a conditional `<AffiliateDisclosure />` (shown when frontmatter `affiliateDisclosure: true`), `<TableOfContents />`, the rendered body split at its paragraph midpoint with `<AdSlot />` placements (top/mid/bottom), then `<RelatedArticles />` (same category, excludes self).
- `extractFaqItems()` (`src/lib/content.ts`) parses `## FAQ`-style Q&A directly out of the article body — FAQ schema is always sourced from this, never hand-typed separately, so the JSON-LD can't drift from what's visibly on the page (see Structured data below).

### Structured data (schema.org / JSON-LD)

`src/config/site.ts` (`SITE_CONFIG`) is the single source of truth for org name, site URL, logo URL, and the default author — every schema component reads from it rather than hardcoding values. `src/lib/seo.ts` (`buildMetadata()`) is the single place that produces canonical/OG/title metadata; pages spread its output into their `metadata` / `generateMetadata` export rather than hand-rolling their own.

- `src/components/schema/*.tsx` — one component per schema.org `@type` (`OrganizationSchema`, `WebSiteSchema`, `ArticleSchema`, `BreadcrumbListSchema`, `FAQSchema`, `PersonSchema`, `SoftwareApplicationSchema`). `OrganizationSchema` and `WebSiteSchema` render once, site-wide, from `src/app/layout.tsx`; everything else renders per-page and cross-references the sitewide entities via a stable `@id` (e.g. `${siteUrl}/#organization`) rather than duplicating them.
- `SoftwareApplicationSchema` goes on the free interactive tools (Noise Diagnoser, Complaint Letter Generator, Noise Log, Noise Law Lookup).
- `FAQSchema`: Google dropped FAQ rich results in May 2026, so this is now Bing/AI-answer-engine-only (AI Overviews, Perplexity, ChatGPT) — don't expect a Google SERP rich result from it, and don't add it to a page unless the Q&A content is genuinely visible on that page (mismatched FAQ markup risks a manual spam action).
- Validate structured data with `npm run schema:validate`, which crawls the live sitemap, checks required fields per `@type`, confirms every `{"@id": "..."}` reference resolves to something actually emitted, and cross-checks FAQ question/answer text against the page's visible HTML.

### Noise-law data (`/noise-laws`)

Per-jurisdiction legal reference content, structured as flat JSON rather than markdown, loaded at build time by `src/lib/noise-law.ts`: one file per state (`content/noise-law/states/{2-letter-slug}.json`) and one per seeded city (`content/noise-law/cities/{state-slug}/{city-slug}.json`). All 50 states have a file so `/noise-laws/[state]` never 404s; not all are researched yet.

- **Accuracy rule (read `content/noise-law/README.md` before touching this data):** every state file has a `verified` boolean. `false` means no legal research has been done — those four legal-detail fields (`impliedWarrantyOfHabitability`, `covenantOfQuietEnjoyment`, `noticeToRemedy`, `rentEscrowOrRepairDeduct`) are omitted entirely rather than populated with invented statute numbers, and `src/app/noise-laws/[state]/page.tsx` renders generic guidance plus an "under review" notice instead. Never invent a citation, statute section, or URL. Anything researched but not confirmed against a primary source goes in the top-level `internalNotes` array as a `"TODO_VERIFY: ..."` string — never inside a `summary`/`notes` field, since those render directly on the public page.
- Every entry needs `lastVerified` (ISO date) and a non-empty `sources` array once `verified: true`.
- `content/noise-law/README.md` tracks which states currently have `verified: true` data — check it (or grep `"verified": true` across `content/noise-law/states/`) before assuming a given state is done, and update the checklist there when adding new verified states.

### Client-side tools (the site's moat)

Several pages are free, no-signup interactive tools rather than content: `NoiseDiagnoser`, `LetterGenerator`, `NoiseLog`, `NoiseLawLookup`. `src/lib/noise-log-store.ts` is the pattern to follow for any client-only data — it's explicitly a "no network calls, ever" store (IndexedDB preferred, falls back to a single `localStorage` key if IndexedDB is unavailable) and that constraint is stated in the file's own header comment, not just convention.

### Monetization/config points (intentionally unwired)

- `src/lib/ads-config.ts` — single `AD_NETWORK_ENABLED` flag; `AdSlot.tsx` renders a labeled placeholder box until a real ad network is wired in here. Never hardcode a real network/publisher ID — read it from an env var.
- `src/lib/newsletter-config.ts` — reads `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`; `NewsletterForm.tsx` POSTs `{ email }` there if set, otherwise shows a simulated success state so the component still demos with zero setup.
- `NEXT_PUBLIC_AD_CLIENT_ID` (also in `.env.example`) renders the AdSense loader script site-wide from `layout.tsx` when set, separately from actually turning on ad units via `AD_NETWORK_ENABLED` above.
- All env vars are documented in `.env.example`. Never commit real ad-network IDs or provider endpoints/secrets.

### Legacy shop (removed)

The site originally had a full e-commerce catalogue (`src/app/shop/page.tsx`, `ProductGrid.tsx`, `CartButton.tsx`, `CartContext.tsx`, `src/lib/products.ts` — a localStorage-persisted cart via React Context) from its "boutique acoustic-design shop" positioning. That was fully removed when the site committed to a free-content/affiliate model with nothing to sell. `/shop` now **301-redirects to `/`** via `redirects()` in `next.config.ts` (so old bookmarks/inbound links don't 404). If a future affiliate-gear roundup is wanted, build it as a fresh content page — don't resurrect the cart.

### Images

`next/image` remote patterns (`next.config.ts`) currently only allow `lh3.googleusercontent.com` (the original Stitch-mockup image host). Images from any other external domain need that domain added to `images.remotePatterns` first, or the build will fail.

### Other pages

- `/community` — forum-style board (`ForumBoard.tsx`, client-side only, not persisted) plus a "Know Your Rights" tenant-law primer section.
- `/solutions` — longer-form "how acoustics work" explainer with a mouse-parallax effect (`SolutionsParallax.tsx`).
- `/search` — server-rendered keyword search over cluster articles (title/description/keyword/category match), not a client-side or third-party search index.
- `/about`, `/disclosure` — E-E-A-T and FTC-disclosure trust pages. `/about` has a real author bio/credentials section, a research-methodology section, and a corrections/feedback contact; `PersonSchema` renders there too. `/disclosure` covers advertising, affiliate links, editorial independence, and contact.

### SEO audit tooling (`scripts/seo-audit/`)

Framework-agnostic scripts (talk to the live deployed site over HTTP or walk the local repo) rather than Next.js-specific tooling — see comments in each file for why. `crawl-audit.mjs` crawls the live site via sitemap; `repo-audit.mjs` checks local repo conventions (frontmatter completeness, metadata exports, etc.); `auto-fix.mjs` applies only unambiguous, reversible fixes found by `repo-audit.mjs` (dry-run by default, `--apply` to write), logging to `seo-fixes-applied.md`. Judgment-call gaps (missing alt text, missing descriptions) are reported to a checklist, never invented.

## Deployment

Deployed on Vercel (project `noisy-apartment`, linked locally via `.vercel/`) — not Cloudflare Pages/Astro, despite what older planning docs for this project may say. The GitHub integration for auto-deploy-on-push has previously gone silent (commits landed on `main` without a new deployment happening). If a push doesn't seem to result in a live update, check with `npx vercel ls noisy-apartment` and redeploy directly with `npx vercel --prod` if needed.
