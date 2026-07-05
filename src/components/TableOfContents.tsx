import type { TocItem } from "@/lib/content";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 border border-outline-variant bg-surface-container-low p-6"
    >
      <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4">
        In This Guide
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${item.id}`}
              className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
