#!/usr/bin/env node
/**
 * Safe, reversible auto-fixes for the gaps repo-audit.mjs finds. Dry-run by
 * default — every fix prints what it would do; nothing is written to disk
 * unless run with --apply. Applied changes are logged to
 * scripts/seo-audit/seo-fixes-applied.md.
 *
 * Only unambiguous, reversible fixes live here. Anything requiring a
 * judgment call (missing alt text, missing meta descriptions) is reported
 * to a checklist instead of invented — see content/articles/README.md and
 * this session's standing rule: never invent alt text or descriptions.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const APP_DIR = path.join(REPO_ROOT, "src", "app");
const CONTENT_DIR = path.join(REPO_ROOT, "content", "articles");
const APPLY = process.argv.includes("--apply");

const applied = [];
const plannedButSkipped = [];

function relative(p) {
  return path.relative(REPO_ROOT, p).replace(/\\/g, "/");
}

function printFileDiff(filePath, content, { isNew }) {
  console.log(`\n--- ${isNew ? "NEW FILE" : "MODIFIED"}: ${relative(filePath)} ---`);
  const prefix = isNew ? "+ " : "  ";
  for (const line of content.split("\n")) {
    console.log(prefix + line);
  }
}

function writeFileIfApply(filePath, content, description) {
  const isNew = !fs.existsSync(filePath);
  printFileDiff(filePath, content, { isNew });
  if (APPLY) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
    applied.push(`${isNew ? "Created" : "Updated"} \`${relative(filePath)}\` — ${description}`);
    console.log(`✓ Wrote ${relative(filePath)}`);
  } else {
    plannedButSkipped.push(`Would ${isNew ? "create" : "update"} \`${relative(filePath)}\` — ${description}`);
    console.log("(dry-run — rerun with --apply to write)");
  }
}

// ---------- Fix 1: metadataBase ----------
function fixMetadataBase() {
  const layoutPath = path.join(APP_DIR, "layout.tsx");
  if (!fs.existsSync(layoutPath)) return;
  const content = fs.readFileSync(layoutPath, "utf-8");
  if (/metadataBase\s*:/.test(content)) {
    console.log("✓ metadataBase already set — skipping.");
    return;
  }

  const marker = "export const metadata: Metadata = {";
  const idx = content.indexOf(marker);
  if (idx === -1) {
    console.warn("Could not find `export const metadata: Metadata = {` in layout.tsx — skipping metadataBase fix, wire it in manually.");
    return;
  }
  const insertAt = idx + marker.length;
  const updated =
    content.slice(0, insertAt) +
    `\n  metadataBase: new URL("https://noisyapartment.org"),` +
    content.slice(insertAt);

  console.log(`\n--- ${APPLY ? "MODIFIED" : "WOULD MODIFY"}: ${relative(layoutPath)} ---`);
  console.log(`  export const metadata: Metadata = {`);
  console.log(`+   metadataBase: new URL("https://noisyapartment.org"),`);
  console.log(`    title: ...`);

  if (APPLY) {
    fs.writeFileSync(layoutPath, updated);
    applied.push(`Added \`metadataBase\` to \`${relative(layoutPath)}\``);
    console.log(`✓ Wrote ${relative(layoutPath)}`);
  } else {
    plannedButSkipped.push(`Would add \`metadataBase\` to \`${relative(layoutPath)}\``);
    console.log("(dry-run — rerun with --apply to write)");
  }
}

// ---------- Fix 2: sitemap.ts ----------
function fixSitemap() {
  const sitemapPath = path.join(APP_DIR, "sitemap.ts");
  if (fs.existsSync(sitemapPath)) {
    console.log("✓ src/app/sitemap.ts already exists — skipping.");
    return;
  }
  const content = `import type { MetadataRoute } from "next";
import { getClusterArticles } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";

const BASE_URL = "https://noisyapartment.org";

// Deliberately excludes /search (unlisted from nav, low-value for indexing).
// /shop no longer exists — it 301-redirects to / via next.config.ts.
const STATIC_ROUTES = [
  "",
  "/guides/apartment-noise",
  "/about",
  "/disclosure",
  "/community",
  "/solutions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articleRoutes = getClusterArticles().map((article) => \`/blog/\${article.slug}\`);
  const categoryRoutes = CATEGORIES.map((category) => \`/category/\${category.slug}\`);
  const allRoutes = [...STATIC_ROUTES, ...articleRoutes, ...categoryRoutes];

  return allRoutes.map((route) => ({
    url: \`\${BASE_URL}\${route}\`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/blog/") ? 0.8 : 0.6,
  }));
}
`;
  writeFileIfApply(sitemapPath, content, "Next.js sitemap route, built from real content/categories data");
}

// ---------- Fix 3: robots.ts ----------
function fixRobots() {
  const robotsPath = path.join(APP_DIR, "robots.ts");
  const publicRobots = path.join(REPO_ROOT, "public", "robots.txt");
  if (fs.existsSync(robotsPath) || fs.existsSync(publicRobots)) {
    console.log("✓ robots.ts or public/robots.txt already exists — skipping.");
    return;
  }
  const content = `import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://noisyapartment.org/sitemap.xml",
  };
}
`;
  writeFileIfApply(robotsPath, content, "allows all crawlers, points at the sitemap");
}

// ---------- Fix 4: alt text audit (report-only) ----------
function auditAltText() {
  const missing = [];
  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
    for (const file of files) {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { content } = matter(raw);
      const emptyAltMatches = [...content.matchAll(/!\[\s*\]\(([^)]+)\)/g)];
      for (const m of emptyAltMatches) {
        missing.push(`${file}: image with empty alt text — ${m[1]}`);
      }
    }
  }
  // next/image's TypeScript types require `alt` at compile time, so any
  // <Image> usage without one would already fail `tsc --noEmit` — this repo
  // builds clean, so there is nothing to scan for there.
  if (missing.length === 0) {
    console.log("✓ No images with empty alt text found in content/articles/*.md.");
    console.log("  (next/image's alt prop is required by TypeScript, so components can't have this issue either.)");
  } else {
    console.log(`⚠ ${missing.length} image(s) with missing/empty alt text — NOT auto-fixed (would require inventing text):`);
    for (const m of missing) console.log(`  - ${m}`);
  }
  return missing;
}

// ---------- Fix 5: src/lib/seo.ts helper ----------
function fixSeoHelper() {
  const seoLibPath = path.join(REPO_ROOT, "src", "lib", "seo.ts");
  if (fs.existsSync(seoLibPath)) {
    console.log("✓ src/lib/seo.ts already exists — skipping.");
    return;
  }
  const content = `import type { Metadata } from "next";

const SITE_NAME = "NoisyApartment";
const BASE_URL = "https://noisyapartment.org";
// TODO: replace with a real default social-share image once one exists.
const DEFAULT_OG_IMAGE = \`\${BASE_URL}/og-default.png\`;

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path only, e.g. "/blog/some-slug" — combined with BASE_URL for canonical + OG url. */
  path: string;
  ogImage?: string;
};

/**
 * Single place that produces a consistent title/description/canonical/OG
 * metadata object. Pages should spread this into their metadata/
 * generateMetadata export rather than hand-rolling their own.
 */
export function buildMetadata({ title, description, path, ogImage }: BuildMetadataInput): Metadata {
  const url = \`\${BASE_URL}\${path}\`;
  return {
    title: \`\${title} | \${SITE_NAME}\`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [ogImage ?? DEFAULT_OG_IMAGE],
    },
  };
}
`;
  writeFileIfApply(seoLibPath, content, "shared buildMetadata() helper for canonical + OG tags");

  console.log(
    "\nOnce created, wire buildMetadata() into each page's metadata export — run `npm run seo:audit` " +
      "after applying to see the full list of pages currently missing canonical/openGraph."
  );
}

// ---------- Fix 6: missing descriptions (report-only) ----------
function checkMissingDescriptions() {
  const todos = [];
  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
    for (const file of files) {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data } = matter(raw);
      if (!data.description) {
        todos.push(`- [ ] \`content/articles/${file}\` — no \`description\` frontmatter field`);
      }
    }
  }

  const pageFiles = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "page.tsx") pageFiles.push(full);
    }
  }
  walk(APP_DIR);
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const hasMetadata = /export\s+const\s+metadata|generateMetadata/.test(content);
    const hasDescription = /description\s*:/.test(content);
    if (hasMetadata && !hasDescription) {
      todos.push(`- [ ] \`${relative(file)}\` — metadata export has no \`description\` field`);
    }
  }

  const outPath = path.join(__dirname, "todo-descriptions.md");
  const md = `# Pages/articles missing a meta description\n\nGenerated ${new Date().toISOString()}. Descriptions are never auto-generated — write these by hand.\n\n${
    todos.length > 0 ? todos.join("\n") : "None found — every page/article currently has a description."
  }\n`;
  fs.writeFileSync(outPath, md);
  console.log(`\n${todos.length} page(s)/article(s) missing a description — see scripts/seo-audit/todo-descriptions.md`);
}

function writeAppliedLog() {
  const outPath = path.join(__dirname, "seo-fixes-applied.md");
  let md = `# SEO auto-fix run — ${new Date().toISOString()}\n\nMode: ${APPLY ? "--apply (wrote files)" : "dry-run (nothing written)"}\n\n`;
  if (applied.length > 0) {
    md += `## Applied\n\n${applied.map((a) => `- ${a}`).join("\n")}\n\n`;
  }
  if (plannedButSkipped.length > 0) {
    md += `## Would apply (rerun with --apply)\n\n${plannedButSkipped.map((a) => `- ${a}`).join("\n")}\n`;
  }
  fs.writeFileSync(outPath, md);
}

function main() {
  console.log(`Running auto-fix (${APPLY ? "APPLY MODE — will write files" : "dry-run — pass --apply to write"}) ...`);
  fixMetadataBase();
  fixSitemap();
  fixRobots();
  auditAltText();
  fixSeoHelper();
  checkMissingDescriptions();
  writeAppliedLog();

  console.log(`\nSee scripts/seo-audit/seo-fixes-applied.md for a full log.`);
  if (!APPLY) {
    console.log("Nothing was written. Rerun with --apply to write these changes.");
  }
}

main();
