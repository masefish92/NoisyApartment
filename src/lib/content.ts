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
