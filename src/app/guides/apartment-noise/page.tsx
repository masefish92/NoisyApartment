import Link from "next/link";
import type { Metadata } from "next";
import {
  getPillarArticle,
  getClusterArticles,
  renderMarkdown,
  extractFirstImage,
} from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { SITE_CONFIG } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import TableOfContents from "@/components/TableOfContents";
import ArticleSchema from "@/components/schema/ArticleSchema";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";

export const metadata: Metadata = buildMetadata({
  title: "The Complete Guide to Apartment Noise",
  description:
    "Every noise problem apartment dwellers face, and how to fix it — organized by source and by room.",
  path: "/guides/apartment-noise",
});

export default async function ApartmentNoisePillarPage() {
  const pillar = getPillarArticle();
  const clusterArticles = getClusterArticles();

  const articlesByCategory = CATEGORIES.map((category) => ({
    category,
    articles: clusterArticles.filter((article) => article.category === category.slug),
  })).filter((group) => group.articles.length > 0);

  if (!pillar) {
    return (
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
          The Complete Guide to Apartment Noise
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          This hub page is reserved for our pillar guide — content coming soon.
        </p>
      </div>
    );
  }

  const { html, toc } = await renderMarkdown(pillar.content);
  const pageUrl = `${SITE_CONFIG.siteUrl}/guides/apartment-noise`;
  const image = pillar.heroImage ?? extractFirstImage(pillar.content);

  return (
    <article className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: pillar.title, url: pageUrl },
        ]}
      />
      <ArticleSchema
        headline={pillar.title}
        description={pillar.description}
        url={pageUrl}
        image={image}
        datePublished={pillar.publishDate}
        dateModified={pillar.updatedDate ?? pillar.publishDate}
        author={{ name: pillar.author, url: `${SITE_CONFIG.siteUrl}/about` }}
        keywords={pillar.keyword}
      />

      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
        {pillar.title}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
        {pillar.description}
      </p>

      <TableOfContents items={toc} />
      <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />

      {articlesByCategory.length > 0 && (
        <section className="mt-16 border-t border-outline-variant pt-10">
          <h2 className="font-headline-md text-headline-md text-primary mb-8">
            Browse Every Guide
          </h2>
          <div className="space-y-10">
            {articlesByCategory.map(({ category, articles }) => (
              <div key={category.slug}>
                <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
                  {category.label}
                </h3>
                <ul className="space-y-2">
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="font-body-md text-primary hover:text-secondary underline"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
