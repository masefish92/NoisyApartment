#!/usr/bin/env node
/**
 * Local repo checks — the Next.js/App Router equivalents of the Astro-
 * specific checks in the original brief. See the mapping table in the plan:
 * this repo has no astro.config, so "site:", "@astrojs/sitemap", and a
 * shared Astro <head> component all map to Next.js's own conventions
 * (sitemap.ts/robots.ts file routes, metadataBase, and each page's
 * metadata/generateMetadata export) rather than a literal find-and-replace.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const APP_DIR = path.join(REPO_ROOT, "src", "app");
const CONTENT_DIR = path.join(REPO_ROOT, "content", "articles");

const findings = [];
function record(category, status, message, file = "") {
  findings.push({ category, status, message, file });
}

function walk(dir, matchFn, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, matchFn, results);
    } else if (matchFn(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function relative(p) {
  return path.relative(REPO_ROOT, p).replace(/\\/g, "/");
}

// 1. sitemap.ts
function checkSitemap() {
  const sitemapPath = path.join(APP_DIR, "sitemap.ts");
  if (fs.existsSync(sitemapPath)) {
    record("Sitemap", "PASS", "src/app/sitemap.ts exists (Next.js sitemap route)", relative(sitemapPath));
  } else {
    record(
      "Sitemap",
      "FAIL",
      "No src/app/sitemap.ts — Next.js has no sitemap route. This repo has no @astrojs/sitemap equivalent of any kind. Fix: create src/app/sitemap.ts (see auto-fix.mjs).",
      "src/app/sitemap.ts"
    );
  }
}

// robots.ts (mirrors the sitemap check — same file-convention pattern)
function checkRobots() {
  const robotsPath = path.join(APP_DIR, "robots.ts");
  const publicRobots = path.join(REPO_ROOT, "public", "robots.txt");
  if (fs.existsSync(robotsPath)) {
    record("Robots", "PASS", "src/app/robots.ts exists", relative(robotsPath));
  } else if (fs.existsSync(publicRobots)) {
    record("Robots", "PASS", "public/robots.txt exists (static)", relative(publicRobots));
  } else {
    record(
      "Robots",
      "FAIL",
      "No src/app/robots.ts and no public/robots.txt — the live site currently serves no robots.txt at all. Fix: create src/app/robots.ts (see auto-fix.mjs).",
      "src/app/robots.ts"
    );
  }
}

// 2. metadataBase in root layout
function checkMetadataBase() {
  const layoutPath = path.join(APP_DIR, "layout.tsx");
  if (!fs.existsSync(layoutPath)) {
    record("Metadata", "FAIL", "src/app/layout.tsx not found", "src/app/layout.tsx");
    return;
  }
  const content = fs.readFileSync(layoutPath, "utf-8");
  if (/metadataBase\s*:/.test(content)) {
    record("Metadata", "PASS", "metadataBase is set in the root layout", relative(layoutPath));
  } else {
    record(
      "Metadata",
      "FAIL",
      "No metadataBase in src/app/layout.tsx's metadata export — this is the Next.js equivalent of astro.config's `site:`, required for canonical URLs and relative OG image resolution to work correctly. Fix: add metadataBase: new URL(\"https://noisyapartment.org\") (see auto-fix.mjs).",
      relative(layoutPath)
    );
  }
}

// 3. every page.tsx has metadata/generateMetadata, and canonical/openGraph
function checkPageMetadata() {
  const pageFiles = walk(APP_DIR, (name) => name === "page.tsx");
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const hasMetadataExport = /export\s+const\s+metadata\s*[:=]/.test(content);
    const hasGenerateMetadata = /export\s+(async\s+)?function\s+generateMetadata/.test(content);
    const rel = relative(file);

    if (!hasMetadataExport && !hasGenerateMetadata) {
      record(
        "Metadata",
        "FAIL",
        "No metadata export or generateMetadata() — page has no page-level SEO metadata at all (only inherits the root layout's).",
        rel
      );
      continue;
    }
    record("Metadata", "PASS", "Has a metadata export or generateMetadata()", rel);

    if (!/alternates\s*:/.test(content) && !/canonical/.test(content)) {
      record("Metadata", "WARN", "No canonical URL set (metadata.alternates.canonical)", rel);
    }
    if (!/openGraph\s*:/.test(content)) {
      record("Metadata", "WARN", "No openGraph object set in metadata", rel);
    }
  }
}

// 4. article frontmatter missing title/description
function checkArticleFrontmatter() {
  if (!fs.existsSync(CONTENT_DIR)) return;
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  for (const file of files) {
    const full = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { data } = matter(raw);
    const rel = relative(full);
    const missing = [];
    if (!data.title) missing.push("title");
    if (!data.description) missing.push("description");
    if (missing.length > 0) {
      record("Content Frontmatter", "FAIL", `Missing frontmatter field(s): ${missing.join(", ")}`, rel);
    } else {
      record("Content Frontmatter", "PASS", "title and description present", rel);
    }
  }
}

// 5. reusable SEO helper (this repo's equivalent of a shared <SEO.astro>)
function checkSeoHelper() {
  const seoLibPath = path.join(REPO_ROOT, "src", "lib", "seo.ts");
  if (fs.existsSync(seoLibPath)) {
    record("Metadata", "PASS", "src/lib/seo.ts helper exists", relative(seoLibPath));
  } else {
    record(
      "Metadata",
      "WARN",
      "No src/lib/seo.ts — every page currently hand-rolls its own metadata object rather than sharing one buildMetadata() helper, which is how canonical/OG ended up missing everywhere. Fix: generate src/lib/seo.ts (see auto-fix.mjs).",
      "src/lib/seo.ts"
    );
  }
}

function writeReport() {
  const outPath = path.join(__dirname, "seo-report.md");
  const existing = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf-8") : "";

  let md = `\n---\n\n# Repo Audit (Next.js) — ${new Date().toISOString()}\n\n`;
  const categories = [...new Set(findings.map((f) => f.category))];
  md += "| Category | PASS | WARN | FAIL |\n|---|---|---|---|\n";
  for (const cat of categories) {
    const inCat = findings.filter((f) => f.category === cat);
    md += `| ${cat} | ${inCat.filter((f) => f.status === "PASS").length} | ${
      inCat.filter((f) => f.status === "WARN").length
    } | ${inCat.filter((f) => f.status === "FAIL").length} |\n`;
  }
  md += "\n";
  for (const f of findings) {
    md += `- **${f.status}** [${f.category}] ${f.file ? `\`${f.file}\`: ` : ""}${f.message}\n`;
  }

  fs.writeFileSync(outPath, existing + md);
  console.log(`Repo audit appended to ${path.relative(REPO_ROOT, outPath)}`);
}

function main() {
  console.log("Running repo audit ...");
  checkSitemap();
  checkRobots();
  checkMetadataBase();
  checkPageMetadata();
  checkArticleFrontmatter();
  checkSeoHelper();
  writeReport();

  const failCount = findings.filter((f) => f.status === "FAIL").length;
  const warnCount = findings.filter((f) => f.status === "WARN").length;
  console.log(`Done. ${failCount} FAIL, ${warnCount} WARN.`);
}

main();
