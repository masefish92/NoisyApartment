import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategory, type CategoryGroup } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/content";

const GROUP_LABELS: Record<CategoryGroup, string> = {
  source: "By Noise Source",
  room: "By Room",
  resource: "Tools & Resources",
};

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.label} Noise Guides | NoisyApartment`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
        {GROUP_LABELS[category.group]}
      </p>
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
        {category.label}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-16 max-w-2xl">
        {category.description}
      </p>

      {articles.length === 0 ? (
        <p className="font-body-md text-on-surface-variant border border-outline-variant p-8 text-center">
          Guides for this topic are coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block border border-outline-variant p-6 hover:border-primary transition-colors"
            >
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
