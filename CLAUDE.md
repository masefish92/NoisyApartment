# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Naming note

The package/directory is `quiet-apartment` but the brand, GitHub repo (`masefish92/NoisyApartment`), and production domain are all **NoisyApartment** (noisyapartment.org). Same project, don't be thrown by the mismatch.

## Commands

```bash
npm run dev      # Turbopack dev server, http://localhost:3000
npm run build    # production build (also runs the TypeScript check)
npm run start    # serve a production build locally
npm run lint     # ESLint (eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # type-check only, no dedicated package.json script for this
```

There is no test suite in this repo. Verification has been done manually: `npm run build` (confirms static generation succeeds, including with zero markdown content), `npm run lint` / `tsc --noEmit`, and a temporary `npm install -D playwright` for headless-browser visual checks — uninstall it again afterward rather than leaving it as a permanent dependency.

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

### Monetization/config points (intentionally unwired)

- `src/lib/ads-config.ts` — single `AD_NETWORK_ENABLED` flag; `AdSlot.tsx` renders a labeled placeholder box until a real ad network is wired in here. Never hardcode a real network/publisher ID — read it from an env var.
- `src/lib/newsletter-config.ts` — reads `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`; `NewsletterForm.tsx` POSTs `{ email }` there if set, otherwise shows a simulated success state so the component still demos with zero setup.
- Both env vars are documented in `.env.example`. Never commit real ad-network IDs or provider endpoints/secrets.

### Legacy shop (kept, deliberately not in nav)

`src/app/shop/page.tsx`, `ProductGrid.tsx`, `CartButton.tsx`, and `CartContext.tsx` (a localStorage-persisted cart via React Context) are a full e-commerce catalogue left over from this site's original "boutique acoustic-design shop" positioning. The site has since been repositioned to a free-content/affiliate model, so `/shop` is intentionally unlisted from the Header/Footer nav, but the route and code are kept for a possible future affiliate-gear-roundup repurpose. Don't delete it or re-add it to nav without confirming that's actually wanted.

### Images

`next/image` remote patterns (`next.config.ts`) currently only allow `lh3.googleusercontent.com` (the original Stitch-mockup image host). Images from any other external domain need that domain added to `images.remotePatterns` first, or the build will fail.

### Other pages

- `/community` — forum-style board (`ForumBoard.tsx`, client-side only, not persisted) plus a "Know Your Rights" tenant-law primer section.
- `/solutions` — longer-form "how acoustics work" explainer with a mouse-parallax effect (`SolutionsParallax.tsx`).
- `/about`, `/disclosure` — E-E-A-T and FTC-disclosure trust pages. Both still contain `[TODO]`-marked placeholder text (author bio/credentials, legal contact) — do not treat that as real content or remove the markers without replacing them with actual verified information.

## Deployment

Deployed on Vercel (project `noisy-apartment`, linked locally via `.vercel/`) — not Cloudflare Pages/Astro, despite what older planning docs for this project may say. The GitHub integration for auto-deploy-on-push has previously gone silent (commits landed on `main` without a new deployment happening). If a push doesn't seem to result in a live update, check with `npx vercel ls noisy-apartment` and redeploy directly with `npx vercel --prod` if needed.
