/**
 * Single source of truth for structured-data/SEO values that repeat across
 * schema.org markup. Update here, not per-component.
 */
export const SITE_CONFIG = {
  siteName: "NoisyApartment",
  siteUrl: "https://noisyapartment.org",
  organizationName: "NoisyApartment",
  // TODO: no real logo asset exists yet (public/ only has the default
  // create-next-app SVGs). favicon.ico is a real, working image so the
  // Organization schema validates clean today — replace with a proper
  // logo (recommended >=112x112) once one exists.
  logoUrl: "https://noisyapartment.org/favicon.ico",
  // Add real social profile URLs here once they exist.
  sameAs: [] as string[],
  defaultAuthor: {
    name: "Marcus M.",
    url: "https://noisyapartment.org/about",
  },
};
