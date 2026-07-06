import type { MetadataRoute } from "next";
import { getClusterArticles } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";

const BASE_URL = "https://noisyapartment.org";

// Deliberately excludes /search and /shop: both are unlisted from nav, and
// /shop's ?q= param history makes it a poor canonical-indexing candidate.
const STATIC_ROUTES = [
  "",
  "/guides/apartment-noise",
  "/about",
  "/disclosure",
  "/community",
  "/solutions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articleRoutes = getClusterArticles().map((article) => `/blog/${article.slug}`);
  const categoryRoutes = CATEGORIES.map((category) => `/category/${category.slug}`);
  const allRoutes = [...STATIC_ROUTES, ...articleRoutes, ...categoryRoutes];

  return allRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/blog/") ? 0.8 : 0.6,
  }));
}
