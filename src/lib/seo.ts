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
  /** Set to "article" on blog posts so og:type and article:*_time meta emit. */
  type?: "website" | "article";
  /** ISO date string. Only used when type is "article". */
  publishedTime?: string;
  /** ISO date string. Only used when type is "article". */
  modifiedTime?: string;
};

/**
 * Single place that produces a consistent title/description/canonical/OG
 * metadata object. Pages should spread this into their metadata/
 * generateMetadata export rather than hand-rolling their own.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const url = `${BASE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;
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
      images: [image],
      ...(type === "article"
        ? { type: "article" as const, publishedTime, modifiedTime }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
