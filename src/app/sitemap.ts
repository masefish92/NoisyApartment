import type { MetadataRoute } from "next";
import { getClusterArticles } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { getAllStates, getAllCities } from "@/lib/noise-law";

const BASE_URL = "https://noisyapartment.org";

// Deliberately excludes /search (unlisted from nav, low-value for indexing).
// /shop no longer exists — it 301-redirects to / via next.config.ts.
const STATIC_ROUTES = [
  "",
  "/guides/apartment-noise",
  "/about",
  "/disclosure",
  "/community",
  "/solutions",
  "/noise-laws",
  "/noise-log",
  "/tools/noise-diagnoser",
  "/tools/complaint-letter-generator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articleRoutes = getClusterArticles().map((article) => `/blog/${article.slug}`);
  const categoryRoutes = CATEGORIES.map((category) => `/category/${category.slug}`);
  // Unverified states render noindex (see [state]/page.tsx) — omit them here too
  // so the sitemap never advertises a page Google's been told not to index.
  const stateRoutes = getAllStates()
    .filter((state) => state.verified)
    .map((state) => `/noise-laws/${state.stateSlug}`);
  const cityRoutes = getAllCities().map(
    (city) => `/noise-laws/${city.stateSlug}/${city.citySlug}`
  );
  const allRoutes = [
    ...STATIC_ROUTES,
    ...articleRoutes,
    ...categoryRoutes,
    ...stateRoutes,
    ...cityRoutes,
  ];

  return allRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/blog/") ? 0.8 : 0.6,
  }));
}
