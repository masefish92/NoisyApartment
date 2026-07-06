# Article content

Drop one `.md` file per article in this folder. Each file needs frontmatter matching
this exact schema (see `src/lib/content.ts` for the TypeScript type):

```md
---
title: "How to Soundproof a Shared Wall in an Apartment"
slug: "soundproof-shared-wall-apartment"
description: "A step-by-step guide to reducing noise through a shared apartment wall, from cheap fixes to serious renovations."
keyword: "soundproof shared wall apartment"
category: "wall-neighbors"
publishDate: "2026-01-15"
updatedDate: "2026-01-15"
author: "Marcus M."
featured: true
affiliateDisclosure: true
pillar: false
---

Article body goes here, in plain Markdown (GFM tables supported). Use `##` / `###`
for section headings — they automatically get anchor ids and show up in the article's
table of contents.
```

## Field notes

- `slug` — must be unique; becomes the URL at `/blog/<slug>` (except the pillar article,
  see below).
- `category` — must exactly match one of the slugs in `src/lib/categories.ts`
  (`upstairs-neighbors`, `wall-neighbors`, `street-traffic`, `barking-dog`, `doors`,
  `walls`, `windows`, `floors`, `home-office`, or `resources` for cross-cutting
  legal/template/product-roundup content that isn't tied to one noise source or
  room). Used for category pages and the related-articles block.
- `featured` — set `true` to surface the article in the homepage "Popular Guides" section.
- `affiliateDisclosure` — set `true` if the article contains affiliate links; renders the
  disclosure notice near the top automatically.
- `pillar` — set `true` on exactly **one** article, with `slug: "apartment-noise"`. That
  article is served at `/guides/apartment-noise` instead of `/blog/[slug]`, and becomes the
  hub that auto-lists every cluster article grouped by category. Every other article should
  leave this `false` (or omit it).

## Your 5 drafts

Drop the pillar draft in as `apartment-noise.md` with `pillar: true`, and the 4 cluster
drafts as their own files with `pillar: false` (or omitted) and whichever `category` fits
each one best from the list above. Paste them here and I'll place them, or add the files
directly — either works.
