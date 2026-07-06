import { SITE_CONFIG } from "@/config/site";

/**
 * Renders once, site-wide (see src/app/layout.tsx). Includes a real
 * SearchAction since /search?q= exists — do not remove this if /search is
 * ever renamed, update the urlTemplate instead.
 */
export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.siteUrl}/#website`,
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.siteUrl,
    publisher: { "@id": `${SITE_CONFIG.siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
