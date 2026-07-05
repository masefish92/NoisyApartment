import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getClusterArticles,
  getRelatedArticles,
  renderMarkdown,
  splitHtmlAtMidpoint,
} from "@/lib/content";
import { getCategory } from "@/lib/categories";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import TableOfContents from "@/components/TableOfContents";
import AdSlot from "@/components/AdSlot";
import RelatedArticles from "@/components/RelatedArticles";

export async function generateStaticParams() {
  return getClusterArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | NoisyApartment`,
    description: article.description,
  };
}

function formatDate(date: string) {
  // Dates are stored as plain "YYYY-MM-DD" strings; force UTC so the
  // displayed date doesn't shift by a day depending on server/viewer timezone.
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { html, toc } = await renderMarkdown(article.content);
  const [firstHalf, secondHalf] = splitHtmlAtMidpoint(html);
  const related = getRelatedArticles(article);
  const category = getCategory(article.category);

  return (
    <article className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      {category && (
        <Link
          href={`/category/${category.slug}`}
          className="font-label-sm text-label-sm uppercase tracking-widest text-secondary"
        >
          {category.label}
        </Link>
      )}
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 mb-6">
        {article.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body-md text-sm text-on-surface-variant mb-10">
        <span>
          By{" "}
          <Link href="/about" className="text-primary underline">
            {article.author}
          </Link>
        </span>
        <span aria-hidden="true">·</span>
        <span>Published {formatDate(article.publishDate)}</span>
        {article.updatedDate && article.updatedDate !== article.publishDate && (
          <>
            <span aria-hidden="true">·</span>
            <span>Updated {formatDate(article.updatedDate)}</span>
          </>
        )}
      </div>

      {article.affiliateDisclosure && <AffiliateDisclosure />}

      <TableOfContents items={toc} />

      <AdSlot slot="article-top" />

      <div className="prose-article" dangerouslySetInnerHTML={{ __html: firstHalf }} />
      {secondHalf && <AdSlot slot="article-mid" />}
      {secondHalf && (
        <div className="prose-article" dangerouslySetInnerHTML={{ __html: secondHalf }} />
      )}

      <AdSlot slot="article-bottom" />

      <RelatedArticles articles={related} />
    </article>
  );
}
