import { SITE_CONFIG } from "@/config/site";

type ArticleSchemaProps = {
  headline: string;
  description: string;
  url: string;
  /** Absolute or site-relative — resolved against siteUrl if relative. Omit the image key entirely if undefined (never a broken/invented URL). */
  image?: string;
  datePublished: string;
  /** Required — AI Overviews and Google both weight content freshness heavily. */
  dateModified: string;
  author: { name: string; url?: string };
  section?: string;
  keywords?: string;
};

export default function ArticleSchema({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  section,
  keywords,
}: ArticleSchemaProps) {
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_CONFIG.siteUrl}${image}`
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline,
    description,
    ...(resolvedImage ? { image: [resolvedImage] } : {}),
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      ...(author.url ? { "@id": `${author.url}#person` } : {}),
      name: author.name,
      ...(author.url ? { url: author.url } : {}),
    },
    publisher: { "@id": `${SITE_CONFIG.siteUrl}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(section ? { articleSection: section } : {}),
    ...(keywords ? { keywords } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
