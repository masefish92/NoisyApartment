import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  description: string;
  keyword: string;
  /** Must match a slug in src/lib/categories.ts, except for the pillar article. */
  category: string;
  publishDate: string;
  updatedDate?: string;
  author: string;
  featured?: boolean;
  affiliateDisclosure?: boolean;
  /** Marks the single hub article served at /guides/apartment-noise. */
  pillar?: boolean;
  /**
   * Optional explicit hero image (site-relative path, e.g. "/images/affiliate/01-x.jpg").
   * Falls back to extractFirstImage(article.content) when unset — see
   * ArticleSchema wiring in src/app/blog/[slug]/page.tsx.
   */
  heroImage?: string;
};

export type Article = ArticleFrontmatter & {
  content: string;
};

export type TocItem = {
  depth: 2 | 3;
  text: string;
  id: string;
};

function readArticleFiles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md");
}

/** All articles (including the pillar), sorted newest publishDate first. */
export function getAllArticles(): Article[] {
  return readArticleFiles()
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { ...(data as ArticleFrontmatter), content };
    })
    .sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
}

/** Non-pillar articles only — these are what /blog/[slug] and category pages serve. */
export function getClusterArticles(): Article[] {
  return getAllArticles().filter((article) => !article.pillar);
}

export function getPillarArticle(): Article | undefined {
  return getAllArticles().find((article) => article.pillar);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getClusterArticles().find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return getClusterArticles().filter((article) => article.category === categorySlug);
}

export function getFeaturedArticles(limit = 3): Article[] {
  return getClusterArticles()
    .filter((article) => article.featured)
    .slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getClusterArticles()
    .filter((other) => other.slug !== article.slug && other.category === article.category)
    .slice(0, limit);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Renders markdown to HTML with heading ids (via rehype-slug), then extracts
 * a table of contents from the same rendered HTML so anchors always match.
 */
export async function renderMarkdown(markdown: string): Promise<{ html: string; toc: TocItem[] }> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  const html = String(file);
  const toc: TocItem[] = [];
  const headingPattern = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/g;
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(html)) !== null) {
    toc.push({
      depth: Number(match[1]) as 2 | 3,
      id: match[2],
      text: stripTags(match[3]),
    });
  }

  return { html, toc };
}

/**
 * Splits rendered article HTML at the paragraph nearest the midpoint, so the
 * template can insert a mid-article ad slot without needing authors to place
 * it by hand. Falls back to returning the whole thing as the first half when
 * there are too few paragraphs to split meaningfully.
 */
export function splitHtmlAtMidpoint(html: string): [string, string] {
  const parts = html.split("</p>");
  if (parts.length <= 2) return [html, ""];

  const mid = Math.ceil(parts.length / 2);
  const first = parts.slice(0, mid).join("</p>") + "</p>";
  const second = parts.slice(mid).join("</p>");
  return [first, second];
}

// Minimal mdast node shape — just enough of the tree to walk it below,
// without pulling in @types/mdast for two small extractors.
type MdastNode = {
  type: string;
  depth?: number;
  value?: string;
  url?: string;
  children?: MdastNode[];
};

function nodeText(node: MdastNode): string {
  if (typeof node.value === "string") return node.value;
  if (!node.children) return "";
  return node.children.map(nodeText).join("");
}

export type FaqItem = { question: string; answer: string };

/**
 * Parses a real, visible "## FAQ" section (bold-question paragraph followed
 * by its answer text, our standard article FAQ format) directly from the
 * markdown AST. Extracting from the same source that gets rendered
 * guarantees FAQSchema text always matches the visible page — never
 * hand-duplicate this list separately from the article body.
 */
export function extractFaqItems(markdown: string): FaqItem[] {
  const tree = unified().use(remarkParse).parse(markdown) as MdastNode;
  const children = tree.children ?? [];

  const faqHeadingIndex = children.findIndex(
    (node) => node.type === "heading" && /^faq$/i.test(nodeText(node).trim())
  );
  if (faqHeadingIndex === -1) return [];

  const items: FaqItem[] = [];
  for (let i = faqHeadingIndex + 1; i < children.length; i++) {
    const node = children[i];
    if (node.type === "heading") break; // end of the FAQ section
    if (node.type !== "paragraph" || !node.children || node.children.length === 0) continue;

    const [first, ...rest] = node.children;
    if (first.type !== "strong") continue; // not a "**Question?** answer" paragraph

    const question = nodeText(first).trim();
    const answer = rest.map(nodeText).join("").trim();
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

/**
 * First image referenced in the article body (site-relative path, e.g.
 * "/images/affiliate/01-x.jpg"), used as the ArticleSchema image fallback
 * when no explicit heroImage frontmatter is set. Never invents a path —
 * returns undefined if the article has no images at all.
 */
export function extractFirstImage(markdown: string): string | undefined {
  const tree = unified().use(remarkParse).parse(markdown) as MdastNode;

  function findImage(node: MdastNode): string | undefined {
    if (node.type === "image" && node.url) return node.url;
    for (const child of node.children ?? []) {
      const found = findImage(child);
      if (found) return found;
    }
    return undefined;
  }

  return findImage(tree);
}
