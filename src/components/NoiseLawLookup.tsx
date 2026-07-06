"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JurisdictionIndexEntry } from "@/lib/noise-law";

const MAX_RESULTS = 8;

export default function NoiseLawLookup({ index }: { index: JurisdictionIndexEntry[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((entry) => {
        const combined = `${entry.city}, ${entry.state}`.toLowerCase();
        return (
          entry.city.toLowerCase().includes(q) ||
          entry.state.toLowerCase().includes(q) ||
          combined.includes(q)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [query, index]);

  // Fallback: does the query name a state directly, or does the top result belong to one?
  const fallbackState = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const distinctStates = Array.from(
      new Map(index.map((entry) => [entry.stateSlug, entry])).values()
    );
    const directMatch = distinctStates.find((entry) => entry.state.toLowerCase().includes(q));
    if (directMatch) return directMatch;
    return results[0] ?? null;
  }, [query, index, results]);

  function selectResult(path: string) {
    router.push(path);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) selectResult(target.path);
    }
  }

  return (
    <div className="max-w-lg">
      <label className="flex flex-col gap-2">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
          Find your city or state
        </span>
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Seattle or Austin, TX"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="noise-law-lookup-results"
          aria-autocomplete="list"
          className="bg-surface-container-low border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-body-md text-sm transition-colors"
        />
      </label>

      {results.length > 0 && (
        <ul
          id="noise-law-lookup-results"
          role="listbox"
          className="mt-3 border border-outline-variant bg-background divide-y divide-outline-variant"
        >
          {results.map((entry, i) => (
            <li key={entry.path} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onClick={() => selectResult(entry.path)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-4 py-3 font-body-md text-sm transition-colors ${
                  i === activeIndex
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {entry.city}, {entry.state}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim() && (
        <p className="mt-4 font-body-md text-sm text-on-surface-variant">
          Don&apos;t see your city?{" "}
          {fallbackState ? (
            <Link
              href={`/noise-laws/${fallbackState.stateSlug}`}
              className="text-primary underline hover:text-secondary transition-colors"
            >
              View {fallbackState.state} state laws →
            </Link>
          ) : (
            <Link
              href="/noise-laws"
              className="text-primary underline hover:text-secondary transition-colors"
            >
              Browse all states →
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
