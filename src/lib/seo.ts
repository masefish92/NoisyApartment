import type { Metadata } from "next";

const SITE_NAME = "NoisyApartment";
const BASE_URL = "https://noisyapartment.org";
// TODO: replace with a purpose-built social-share image once one exists —
// this is a real existing asset (not a 404), reused as an interim default.
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/hero-poster.jpg`;

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path only, e.g. "/blog/some-slug" — combined with BASE_URL for canonical + OG url. */
  path: string;
  ogImage?: string;
};

/**
 * Single place that produces a consistent title/description/canonical/OG
 * metadata object. Pages should spread this into their metadata/
 * generateMetadata export rather than hand-rolling their own.
 */
export function buildMetadata({ title, description, path, ogImage }: BuildMetadataInput): Metadata {
  const url = `${BASE_URL}${path}`;
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [ogImage ?? DEFAULT_OG_IMAGE],
    },
  };
}
