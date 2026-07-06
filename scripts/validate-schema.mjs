#!/usr/bin/env node
/**
 * Validates every JSON-LD block on the live site: valid JSON, required
 * fields per @type, and that every {"@id": "..."} reference actually
 * resolves to something emitted somewhere on the site. For any FAQPage
 * found, confirms the question/answer text is present in that page's
 * visible HTML (defense-in-depth on top of extractFaqItems() sourcing
 * FAQ content directly from the article body — see src/lib/content.ts).
 *
 * Structurally mirrors scripts/seo-audit/crawl-audit.mjs: fetches the real
 * sitemap.xml, never lets one bad page crash the run.
 */
import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://noisyapartment.org";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "seo-audit");

const findings = []; // { url, status: PASS|WARN|FAIL, message }
const errors = [];
const seenIds = new Map(); // @id -> { type, url }
const idReferences = []; // { id, url, field }
const faqPagesToCheck = []; // { url, items, $ }
const crawledUrls = [];

function record(url, status, message) {
  findings.push({ url, status, message });
}

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    return { res, error: null };
  } catch (error) {
    errors.push({ url, error: String(error) });
    return { res: null, error };
  }
}

async function fetchSitemapUrls() {
  const { res, error } = await safeFetch(`${BASE_URL}/sitemap.xml`);
  if (error || !res || res.status !== 200) {
    console.error("Could not fetch /sitemap.xml — aborting.");
    return [];
  }
  const xml = await res.text();
  const parser = new XMLParser();
  const parsed = parser.parse(xml);
  const entries = Array.isArray(parsed.urlset?.url) ? parsed.urlset.url : [parsed.urlset?.url].filter(Boolean);
  return entries.map((u) => u.loc);
}

const REQUIRED_FIELDS = {
  Organization: ["name", "url", "logo"],
  WebSite: ["name", "url"],
  BlogPosting: ["headline", "description", "datePublished", "dateModified", "author", "publisher"],
  BreadcrumbList: ["itemListElement"],
  SoftwareApplication: ["name", "description", "url", "applicationCategory", "operatingSystem", "offers"],
  FAQPage: ["mainEntity"],
};

function collectIdRefs(obj, url, path = "") {
  if (obj === null || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => collectIdRefs(item, url, `${path}[${i}]`));
    return;
  }
  const keys = Object.keys(obj);
  // A bare @id reference (no other meaningful content) — e.g. publisher: {"@id": "..."}
  if (keys.length === 1 && keys[0] === "@id") {
    idReferences.push({ id: obj["@id"], url, field: path });
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    collectIdRefs(value, url, path ? `${path}.${key}` : key);
  }
}

function validateSchema(schema, url) {
  const type = schema["@type"];
  if (!type) {
    record(url, "WARN", "JSON-LD block has no @type");
    return;
  }
  const required = REQUIRED_FIELDS[type];
  if (!required) {
    record(url, "PASS", `@type ${type} found (no rule defined, skipping field check)`);
  } else {
    const missing = required.filter((field) => schema[field] === undefined);
    if (missing.length > 0) {
      record(url, "FAIL", `${type} missing required field(s): ${missing.join(", ")}`);
    } else {
      record(url, "PASS", `${type} has all required fields`);
    }
  }

  if (schema["@id"]) {
    seenIds.set(schema["@id"], { type, url });
  }
  collectIdRefs(schema, url);

  if (type === "BreadcrumbList") {
    const items = schema.itemListElement ?? [];
    const bad = items.filter((item) => !item.position || !item.name || !item.item);
    if (bad.length > 0) {
      record(url, "FAIL", `BreadcrumbList has ${bad.length} item(s) missing position/name/item`);
    }
  }

  if (type === "FAQPage") {
    const items = (schema.mainEntity ?? []).map((q) => ({
      question: q.name,
      answer: q.acceptedAnswer?.text,
    }));
    faqPagesToCheck.push({ url, items });
  }
}

function normalize(text) {
  return text
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function auditPage(url) {
  const { res, error } = await safeFetch(url);
  if (error || !res || res.status !== 200) {
    record(url, "FAIL", `Could not fetch page (status ${res?.status ?? "n/a"})`);
    return;
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  if (scripts.length === 0) {
    record(url, "WARN", "No JSON-LD found on this page");
    return;
  }

  scripts.each((_, el) => {
    const raw = $(el).html();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      record(url, "FAIL", `JSON-LD block failed to parse: ${parseError.message}`);
      return;
    }
    validateSchema(parsed, url);
  });

  // Stash page text for the FAQ cross-check pass, done after all pages are crawled.
  $("script, style").remove();
  const visibleText = normalize($("body").text());
  const pending = faqPagesToCheck.filter((f) => f.url === url);
  for (const faq of pending) {
    faq.visibleText = visibleText;
  }
}

function checkFaqTextMatches() {
  for (const { url, items, visibleText } of faqPagesToCheck) {
    if (!visibleText) continue;
    for (const item of items) {
      const q = normalize(item.question ?? "");
      const a = normalize(item.answer ?? "");
      if (q && !visibleText.includes(q)) {
        record(url, "FAIL", `FAQPage question not found in visible page text (spam risk): "${item.question}"`);
      }
      if (a && !visibleText.includes(a)) {
        record(url, "FAIL", `FAQPage answer not found in visible page text (spam risk): "${item.answer.slice(0, 60)}..."`);
      }
    }
  }
}

function checkIdReferencesResolve() {
  for (const { id, url, field } of idReferences) {
    if (!seenIds.has(id)) {
      record(url, "FAIL", `@id reference "${id}" (at ${field}) does not resolve to any schema emitted on the site`);
    }
  }
}

function writeReport() {
  const categories = ["PASS", "WARN", "FAIL"];
  const counts = Object.fromEntries(categories.map((c) => [c, findings.filter((f) => f.status === c).length]));

  let md = `# Schema Validation Report — ${BASE_URL}\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `## Summary\n\n| PASS | WARN | FAIL |\n|---|---|---|\n| ${counts.PASS} | ${counts.WARN} | ${counts.FAIL} |\n\n`;

  if (errors.length > 0) {
    md += `## Fetch errors\n\n${errors.map((e) => `- \`${e.url}\`: ${e.error}`).join("\n")}\n\n`;
  }

  md += `## @id entities found site-wide\n\n`;
  for (const [id, info] of seenIds.entries()) {
    md += `- \`${id}\` (${info.type}) — first seen on ${info.url}\n`;
  }

  md += `\n## Per-page detail\n\n`;
  const byUrl = new Map();
  for (const f of findings) {
    if (!byUrl.has(f.url)) byUrl.set(f.url, []);
    byUrl.get(f.url).push(f);
  }
  for (const [url, items] of byUrl.entries()) {
    md += `### ${url}\n\n`;
    for (const item of items) md += `- **${item.status}** ${item.message}\n`;
    md += "\n";
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "schema-validation-report.md"), md);
}

function printTestingHelp() {
  console.log("\n--- Manual validation ---");
  console.log("Paste these URLs into Google's Rich Results Test:");
  console.log("  https://search.google.com/test/rich-results");
  console.log("and the schema.org validator:");
  console.log("  https://validator.schema.org/\n");
  for (const url of crawledUrls) console.log(`  ${url}`);
  console.log(
    "\nReminder: Google's Rich Results Test dropped FAQ support in June 2026 — " +
      "FAQPage markup won't show a FAQ-specific result there anymore. It still validates " +
      "as valid schema.org JSON-LD via the schema.org validator, and still targets Bing + " +
      "AI answer engines, per the code comment in FAQSchema.tsx."
  );
}

async function main() {
  const urls = await fetchSitemapUrls();
  if (urls.length === 0) {
    console.error("No URLs to validate.");
    process.exitCode = 1;
    return;
  }
  console.log(`Validating structured data on ${urls.length} page(s)...`);
  for (const url of urls) {
    crawledUrls.push(url);
    await auditPage(url);
  }

  checkFaqTextMatches();
  checkIdReferencesResolve();
  writeReport();
  printTestingHelp();

  const failCount = findings.filter((f) => f.status === "FAIL").length;
  const warnCount = findings.filter((f) => f.status === "WARN").length;
  console.log(`\nDone. ${failCount} FAIL, ${warnCount} WARN. See scripts/seo-audit/schema-validation-report.md`);
}

main().catch((error) => {
  console.error("validate-schema.mjs encountered a fatal error:", error);
  process.exitCode = 1;
});
