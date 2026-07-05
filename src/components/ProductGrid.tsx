"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "@/components/CartContext";
import type { Category, Product } from "@/lib/products";

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "sleep", label: "Sleep Better" },
  { value: "work", label: "Work Better" },
  { value: "live", label: "Live Better" },
];

export default function ProductGrid({
  products,
  initialQuery,
}: {
  products: Product[];
  initialQuery: string;
}) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState(initialQuery);
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        !query.trim() ||
        product.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        product.description.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  const handleAdd = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categoryLabel,
    });
    setJustAdded(product.id);
    window.setTimeout(() => setJustAdded((id) => (id === product.id ? null : id)), 1400);
  };

  return (
    <>
      {/* Category Navigation */}
      <section className="bg-surface-container py-12 sticky top-[73px] z-40 border-b border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={
                  category === c.value
                    ? "font-label-sm uppercase tracking-widest text-primary border-b-2 border-primary pb-1 transition-colors"
                    : "font-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors pb-1 border-b-2 border-transparent"
                }
              >
                {c.label}
              </button>
            ))}
          </div>
          {query && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border border-outline-variant px-4 py-2 hover:text-primary transition-colors"
              >
                Searching “{query}” <X size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Gallery */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        {filtered.length === 0 ? (
          <p className="text-center font-body-md text-on-surface-variant py-16">
            No products match your search. Try a different term or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-16">
            {filtered.map((product) => (
              <article key={product.id} className="product-card group">
                <div className="aspect-square bg-surface-container-low rounded-lg border border-outline-variant overflow-hidden mb-6 transition-all relative group-hover:shadow-[8px_8px_0px_0px_rgba(81,54,45,0.3)]">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={500}
                    height={500}
                    src={product.image}
                    alt={product.alt}
                  />
                  {product.bestseller && (
                    <span className="absolute top-4 right-4 bg-primary text-on-primary font-label-sm px-3 py-1 rounded-full uppercase tracking-tighter">
                      Bestseller
                    </span>
                  )}
                </div>
                <div className="space-y-2 px-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-md text-headline-md text-primary">
                      {product.name}
                    </h3>
                    <span className="font-body-md text-on-surface-variant">
                      {product.priceLabel}
                    </span>
                  </div>
                  <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                    {product.categoryLabel}
                  </p>
                  <p className="text-on-surface-variant text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <button
                    onClick={() => handleAdd(product)}
                    className="mt-2 w-full bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all active:scale-[0.98]"
                  >
                    {justAdded === product.id ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
