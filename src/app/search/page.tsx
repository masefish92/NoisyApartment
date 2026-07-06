import Link from "next/link";
import type { Metadata } from "next";
import { getClusterArticles } from "@/lib/content";
import { getCategory } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Search | NoisyApartment",
  description: "Search NoisyApartment's guides for your specific noise problem.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const results = query
    ? getClusterArticles().filter((article) => {
        const categoryLabel = getCategory(article.category)?.label ?? "";
        const haystack = [
          article.title,
          article.description,
          article.keyword,
          categoryLabel,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : [];

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
        Search
      </p>
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
        {query ? `Results for “${q.trim()}”` : "Search your noise problem"}
      </h1>

      {!query ? (
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Use the search icon in the header to look up a noise problem, or
          browse guides by{" "}
          <Link href="/guides/apartment-noise" className="text-primary underline">
            source and room
          </Link>{" "}
          instead.
        </p>
      ) : results.length === 0 ? (
        <p className="font-body-md text-on-surface-variant border border-outline-variant p-8 text-center max-w-2xl">
          No guides match “{q.trim()}” yet. Try a different word, or browse the{" "}
          <Link href="/guides/apartment-noise" className="text-primary underline">
            complete guide
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {results.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block border border-outline-variant p-6 hover:border-primary transition-colors"
            >
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
                {getCategory(article.category)?.label ?? article.category}
              </p>
              <h2 className="font-headline-md text-headline-md text-[18px] text-primary mb-2">
                {article.title}
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant line-clamp-3">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
