import Link from "next/link";
import type { Article } from "@/lib/content";
import { getCategory } from "@/lib/categories";

export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16 border-t border-outline-variant pt-10">
      <h2 className="font-headline-md text-headline-md text-primary mb-6">
        Related Guides
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="block border border-outline-variant p-6 hover:border-primary transition-colors"
          >
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
              {getCategory(article.category)?.label ?? article.category}
            </p>
            <h3 className="font-headline-md text-headline-md text-[18px] text-primary mb-2">
              {article.title}
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
