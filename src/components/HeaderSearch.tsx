"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";

export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Search your noise problem"
        className="p-2 rounded-full hover:bg-surface-container-low transition-all text-primary"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-surface-container-low border-b-2 border-primary px-3 py-1.5"
    >
      <Search size={16} className="text-on-surface-variant" />
      <input
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search your noise problem…"
        className="bg-transparent outline-none font-body-md text-sm w-48"
      />
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close search"
        className="text-on-surface-variant hover:text-primary transition-colors"
      >
        <X size={14} />
      </button>
    </form>
  );
}
