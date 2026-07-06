import { SITE_CONFIG } from "@/config/site";

/**
 * Renders once, site-wide (see src/app/layout.tsx). Stable @id lets every
 * other schema on the site reference this same Organization entity instead
 * of repeating/duplicating it.
 */
export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.siteUrl}/#organization`,
    name: SITE_CONFIG.organizationName,
    url: SITE_CONFIG.siteUrl,
    logo: SITE_CONFIG.logoUrl,
    sameAs: SITE_CONFIG.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
