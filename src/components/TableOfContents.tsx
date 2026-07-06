"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TocItem } from "@/lib/content";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Collapsed by default on mobile/tablet (where this renders inline and
    // would otherwise dominate the screen), expanded by default on desktop
    // (where it sits in a slim sticky sidebar rail instead).
    if (window.innerWidth < 1024) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 lg:mb-0 border border-outline-variant bg-surface-container-low p-6"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 font-label-sm text-label-sm uppercase tracking-widest text-primary"
      >
        In This Guide
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <ul className="space-y-2 mt-4">
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
      )}
    </nav>
  );
}
