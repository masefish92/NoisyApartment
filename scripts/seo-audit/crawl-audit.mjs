#!/usr/bin/env node
/**
 * Live-site SEO crawl for https://noisyapartment.org.
 *
 * Framework-agnostic (works the same whether the site is Astro, Next.js,
 * or anything else) — this only ever talks to the deployed site over HTTP.
 * Uses native fetch (Node 18+) rather than node-fetch, and fast-xml-parser
 * only (not also xml2js — same job, no need for both).
 *
 * Never throws on a single bad page: every fetch is wrapped, failures are
 * collected into `errors` and still show up in the report.
 */
import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://noisyapartment.org";
const MAX_PAGES = 100;
const TTFB_WARN_MS = 1500;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = __dirname;

const findings = []; // { category, status: PASS|FAIL|WARN, message, url }
const errors = []; // { url, error }

function record(category, status, message, url = "") {
  findings.push({ category, status, message, url });
}

async function safeFetch(url, options = {}) {
  const start = performance.now();
  try {
    const res = await fetch(url, { redirect: "manual", ...options });
    const elapsedMs = performance.now() - start;
    return { res, elapsedMs, error: null };
  } catch (error) {
    errors.push({ url, error: String(error) });
    return { res: null, elapsedMs: performance.now() - start, error };
  }
}

async function fetchFollowingRedirects(url, maxHops = 5) {
  const chain = [url];
  let current = url;
  for (let i = 0; i < maxHops; i++) {
    const { res, error } = await safeFetch(current);
    if (error || !res) return { finalRes: null, chain, error: error ?? new Error("no response") };
    if ([301, 302, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (!location) return { finalRes: res, chain, error: null };
      current = new URL(location, current).toString();
      chain.push(current);
      continue;
    }
    return { finalRes: res, chain, error: null };
  }
  return { finalRes: null, chain, error: new Error("too many redirects") };
}

// ---------- 1. robots.txt ----------
async function checkRobotsTxt() {
  const { res, error } = await safeFetch(`${BASE_URL}/robots.txt`);
  if (error || !res || res.status !== 200) {
    record("Indexability", "FAIL", "robots.txt did not return 200", `${BASE_URL}/robots.txt`);
    return;
  }
  const body = await res.text();
  const lines = body.split("\n").map((l) => l.trim());

  let blockAll = false;
  let sawSitemap = false;
  let currentUAIsWildcardOrGooglebot = false;

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey) continue;
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      currentUAIsWildcardOrGooglebot = value === "*" || value.toLowerCase() === "googlebot";
    } else if (key === "disallow" && currentUAIsWildcardOrGooglebot) {
      if (value === "/") blockAll = true;
    } else if (key === "sitemap") {
      sawSitemap = true;
    }
  }

  if (blockAll) {
    record("Indexability", "FAIL", "robots.txt disallows / for * or Googlebot", `${BASE_URL}/robots.txt`);
  } else {
    record("Indexability", "PASS", "robots.txt does not block the whole site", `${BASE_URL}/robots.txt`);
  }
  if (!sawSitemap) {
    record("Indexability", "WARN", "robots.txt has no Sitemap: directive", `${BASE_URL}/robots.txt`);
  } else {
    record("Indexability", "PASS", "robots.txt declares a Sitemap:", `${BASE_URL}/robots.txt`);
  }
}

// ---------- 2. sitemap ----------
async function fetchSitemapUrls() {
  const parser = new XMLParser({ ignoreAttributes: false });
  const candidates = [`${BASE_URL}/sitemap-index.xml`, `${BASE_URL}/sitemap.xml`];
  let urls = [];
  let found = false;

  for (const candidate of candidates) {
    const { res, error } = await safeFetch(candidate);
    if (error || !res || res.status !== 200) continue;
    found = true;
    const xml = await res.text();
    let parsed;
    try {
      parsed = parser.parse(xml);
    } catch {
      record("Indexability", "FAIL", `${candidate} did not parse as valid XML`, candidate);
      continue;
    }

    if (parsed.sitemapindex) {
      record("Indexability", "PASS", `${candidate} is a sitemap index`, candidate);
      const entries = Array.isArray(parsed.sitemapindex.sitemap)
        ? parsed.sitemapindex.sitemap
        : [parsed.sitemapindex.sitemap].filter(Boolean);
      for (const entry of entries) {
        const childUrl = entry.loc;
        const { res: childRes } = await safeFetch(childUrl);
        if (!childRes || childRes.status !== 200) continue;
        const childXml = await childRes.text();
        const childParsed = parser.parse(childXml);
        const childUrls = Array.isArray(childParsed.urlset?.url)
          ? childParsed.urlset.url
          : [childParsed.urlset?.url].filter(Boolean);
        urls.push(...childUrls.map((u) => u.loc));
      }
    } else if (parsed.urlset) {
      record("Indexability", "PASS", `${candidate} is a valid urlset`, candidate);
      const entries = Array.isArray(parsed.urlset.url)
        ? parsed.urlset.url
        : [parsed.urlset.url].filter(Boolean);
      urls.push(...entries.map((u) => u.loc));
    }
    record("Indexability", "PASS", `${candidate}: ${urls.length} URL(s) found so far`, candidate);
    break; // prefer the first candidate that resolves
  }

  if (!found) {
    record("Indexability", "FAIL", "Neither /sitemap-index.xml nor /sitemap.xml returned 200", BASE_URL);
  }
  return urls;
}

// ---------- 3. redirects ----------
async function checkRedirects() {
  const variants = [
    `http://noisyapartment.org/`,
    `http://www.noisyapartment.org/`,
    `https://www.noisyapartment.org/`,
  ];
  for (const variant of variants) {
    const { finalRes, chain, error } = await fetchFollowingRedirects(variant);
    if (error || !finalRes) {
      record("Indexability", "WARN", `${variant} did not resolve cleanly: ${error}`, variant);
      continue;
    }
    const chainStr = chain.join(" → ");
    if (chain.length === 1) {
      record(
        "Indexability",
        "WARN",
        `${variant} serves content directly with no redirect to a single canonical domain (chain: ${chainStr})`,
        variant
      );
    } else {
      record("Indexability", "PASS", `${variant} redirects: ${chainStr}`, variant);
    }
  }
}

// ---------- per-page checks ----------
function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function checkHeadingHierarchy($) {
  const headings = $("h1, h2, h3, h4, h5, h6")
    .toArray()
    .map((el) => Number(el.tagName.slice(1)));
  const violations = [];
  let prevLevel = null;
  for (const level of headings) {
    if (prevLevel !== null && level - prevLevel > 1) {
      violations.push(`h${prevLevel} → h${level}`);
    }
    prevLevel = level;
  }
  return violations;
}

async function auditPage(url, titleMap, descMap, internalLinks) {
  const { res, elapsedMs, error } = await safeFetch(url, { redirect: "follow" });
  if (error || !res) {
    record("Technical", "FAIL", `Failed to fetch: ${error}`, url);
    return;
  }
  if (res.status !== 200) {
    record("Technical", "FAIL", `Non-200 status: ${res.status}`, url);
    return;
  }

  if (elapsedMs > TTFB_WARN_MS) {
    record("Technical", "WARN", `Response time ${elapsedMs.toFixed(0)}ms exceeds ${TTFB_WARN_MS}ms`, url);
  } else {
    record("Technical", "PASS", `Response time ${elapsedMs.toFixed(0)}ms`, url);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // noindex
  const robotsMeta = $('meta[name="robots"]').attr("content") ?? "";
  if (/noindex/i.test(robotsMeta)) {
    record("Indexability", "FAIL", "Page has meta robots noindex", url);
  }

  // canonical
  const canonical = $('link[rel="canonical"]').attr("href");
  if (!canonical) {
    record("Indexability", "WARN", "Missing <link rel=canonical>", url);
  } else {
    let sameOrigin = false;
    try {
      const canonicalUrl = new URL(canonical, url);
      sameOrigin = canonicalUrl.origin === new URL(BASE_URL).origin;
      if (!sameOrigin) {
        record("Indexability", "WARN", `Canonical points to a different origin: ${canonical}`, url);
      }
    } catch {
      record("Indexability", "WARN", `Canonical is not a valid URL: ${canonical}`, url);
    }
  }

  // title
  const title = $("title").first().text().trim();
  if (!title) {
    record("On-Page SEO", "FAIL", "Missing <title>", url);
  } else {
    if (title.length < 30 || title.length > 60) {
      record("On-Page SEO", "WARN", `Title length ${title.length} chars (want 30-60): "${title}"`, url);
    } else {
      record("On-Page SEO", "PASS", `Title length OK (${title.length} chars)`, url);
    }
    if (!titleMap.has(title)) titleMap.set(title, []);
    titleMap.get(title).push(url);
  }

  // description
  const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
  if (!description) {
    record("On-Page SEO", "FAIL", "Missing meta description", url);
  } else {
    if (description.length < 120 || description.length > 160) {
      record(
        "On-Page SEO",
        "WARN",
        `Description length ${description.length} chars (want 120-160)`,
        url
      );
    } else {
      record("On-Page SEO", "PASS", `Description length OK (${description.length} chars)`, url);
    }
    if (!descMap.has(description)) descMap.set(description, []);
    descMap.get(description).push(url);
  }

  // h1 count
  const h1Count = $("h1").length;
  if (h1Count !== 1) {
    record("On-Page SEO", "FAIL", `Found ${h1Count} <h1> elements (want exactly 1)`, url);
  } else {
    record("On-Page SEO", "PASS", "Exactly one <h1>", url);
  }

  // heading hierarchy
  const skips = checkHeadingHierarchy($);
  if (skips.length > 0) {
    record("On-Page SEO", "WARN", `Heading level skip(s): ${skips.join(", ")}`, url);
  }

  // images missing alt
  const imgsMissingAlt = $("img")
    .toArray()
    .filter((el) => $(el).attr("alt") === undefined)
    .map((el) => $(el).attr("src"));
  if (imgsMissingAlt.length > 0) {
    record(
      "On-Page SEO",
      "WARN",
      `${imgsMissingAlt.length} image(s) missing alt attribute. First 5: ${imgsMissingAlt
        .slice(0, 5)
        .join(", ")}`,
      url
    );
  }

  // word count
  $("script, style, nav, header, footer").remove();
  const bodyText = $("body").text();
  const wordCount = countWords(bodyText);
  if (wordCount < 300) {
    record("On-Page SEO", "WARN", `Thin content: ${wordCount} words`, url);
  }

  // OG tags
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDescription = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const missingOg = [
    !ogTitle && "og:title",
    !ogDescription && "og:description",
    !ogImage && "og:image",
  ].filter(Boolean);
  if (missingOg.length > 0) {
    record("On-Page SEO", "WARN", `Missing Open Graph tag(s): ${missingOg.join(", ")}`, url);
  } else {
    record("On-Page SEO", "PASS", "All core Open Graph tags present", url);
  }

  // JSON-LD
  const jsonLdCount = $('script[type="application/ld+json"]').length;
  if (jsonLdCount === 0) {
    const isBlogPost = url.includes("/blog/");
    const hint = isBlogPost
      ? " (recommend Article schema for this blog post)"
      : url.includes("/community")
      ? " (recommend FAQPage schema if this page has Q&A content)"
      : "";
    record("On-Page SEO", "WARN", `No JSON-LD structured data found${hint}`, url);
  } else {
    record("On-Page SEO", "PASS", `${jsonLdCount} JSON-LD block(s) found`, url);
  }

  // mixed content
  const httpAssets = [];
  $("img, script, link, iframe").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("href");
    if (src && src.startsWith("http://")) httpAssets.push(src);
  });
  if (httpAssets.length > 0) {
    record("Technical", "WARN", `${httpAssets.length} mixed-content (http://) asset(s): ${httpAssets.slice(0, 5).join(", ")}`, url);
  }

  // collect internal links for the broken-link pass
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
    try {
      const resolved = new URL(href, url);
      if (resolved.origin === new URL(BASE_URL).origin) {
        internalLinks.add(resolved.toString().split("#")[0]);
      }
    } catch {
      // ignore unparsable hrefs
    }
  });
}

function reportDuplicates(map, label) {
  for (const [value, urls] of map.entries()) {
    if (urls.length > 1) {
      record("On-Page SEO", "WARN", `Duplicate ${label} across ${urls.length} pages: "${value}"`, urls.join(", "));
    }
  }
}

async function checkBrokenLinks(internalLinks) {
  for (const link of internalLinks) {
    const { res, error } = await safeFetch(link, { redirect: "follow" });
    if (error || !res) {
      record("Technical", "FAIL", `Broken internal link (fetch error): ${error}`, link);
      continue;
    }
    if (res.status >= 400) {
      record("Technical", "FAIL", `Broken internal link: HTTP ${res.status}`, link);
    }
  }
}

function buildSummaryTable() {
  const categories = [...new Set(findings.map((f) => f.category))];
  const rows = categories.map((cat) => {
    const inCat = findings.filter((f) => f.category === cat);
    return {
      category: cat,
      PASS: inCat.filter((f) => f.status === "PASS").length,
      WARN: inCat.filter((f) => f.status === "WARN").length,
      FAIL: inCat.filter((f) => f.status === "FAIL").length,
    };
  });
  const totals = {
    PASS: findings.filter((f) => f.status === "PASS").length,
    WARN: findings.filter((f) => f.status === "WARN").length,
    FAIL: findings.filter((f) => f.status === "FAIL").length,
  };

  let md = "| Category | PASS | WARN | FAIL |\n|---|---|---|---|\n";
  for (const row of rows) {
    md += `| ${row.category} | ${row.PASS} | ${row.WARN} | ${row.FAIL} |\n`;
  }
  md += `| **Total** | **${totals.PASS}** | **${totals.WARN}** | **${totals.FAIL}** |\n`;
  return md;
}

function writeReports() {
  const summary = buildSummaryTable();
  let md = `# SEO Crawl Report — ${BASE_URL}\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `## Summary\n\n${summary}\n`;

  if (errors.length > 0) {
    md += `## Fetch Errors (${errors.length})\n\n`;
    for (const e of errors) {
      md += `- \`${e.url}\`: ${e.error}\n`;
    }
    md += "\n";
  }

  const byUrl = new Map();
  for (const f of findings) {
    const key = f.url || "(site-wide)";
    if (!byUrl.has(key)) byUrl.set(key, []);
    byUrl.get(key).push(f);
  }

  md += `## Per-Page Detail\n\n`;
  for (const [url, items] of byUrl.entries()) {
    md += `### ${url}\n\n`;
    for (const item of items) {
      md += `- **${item.status}** [${item.category}] ${item.message}\n`;
    }
    md += "\n";
  }

  fs.writeFileSync(path.join(OUT_DIR, "seo-report.md"), md);
  fs.writeFileSync(
    path.join(OUT_DIR, "seo-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), findings, errors }, null, 2)
  );
}

async function main() {
  console.log(`Auditing ${BASE_URL} ...`);
  await checkRobotsTxt();
  const sitemapUrls = await fetchSitemapUrls();
  await checkRedirects();

  const pagesToAudit = sitemapUrls.slice(0, MAX_PAGES);
  if (pagesToAudit.length === 0) {
    console.warn("No sitemap URLs found — falling back to auditing the homepage only.");
    pagesToAudit.push(`${BASE_URL}/`);
  }

  const titleMap = new Map();
  const descMap = new Map();
  const internalLinks = new Set();

  for (const url of pagesToAudit) {
    process.stdout.write(`  checking ${url}\n`);
    await auditPage(url, titleMap, descMap, internalLinks);
  }

  reportDuplicates(titleMap, "title");
  reportDuplicates(descMap, "description");

  console.log(`Checking ${internalLinks.size} unique internal link(s) for breakage ...`);
  await checkBrokenLinks(internalLinks);

  writeReports();
  const failCount = findings.filter((f) => f.status === "FAIL").length;
  const warnCount = findings.filter((f) => f.status === "WARN").length;
  console.log(`\nDone. ${failCount} FAIL, ${warnCount} WARN. See scripts/seo-audit/seo-report.md`);
}

main().catch((error) => {
  console.error("crawl-audit.mjs encountered a fatal error:", error);
  process.exitCode = 1;
});
