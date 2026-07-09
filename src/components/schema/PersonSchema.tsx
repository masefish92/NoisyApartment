import { SITE_CONFIG } from "@/config/site";

/**
 * Renders on /about. @id matches the author.url + "#person" reference that
 * ArticleSchema already builds for every post (see
 * src/app/blog/[slug]/page.tsx) — without this, that reference was dangling.
 */
export default function PersonSchema() {
  const personUrl = `${SITE_CONFIG.siteUrl}/about`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${personUrl}#person`,
    name: SITE_CONFIG.defaultAuthor.name,
    url: personUrl,
    jobTitle: "Founder & Editor",
    worksFor: { "@id": `${SITE_CONFIG.siteUrl}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
