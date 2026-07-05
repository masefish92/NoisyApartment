"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";

type Topic = {
  id: string;
  title: string;
  tags: string[];
  voices: number;
  latest: string;
};

const INITIAL_TOPICS: Topic[] = [
  {
    id: "t1",
    title: 'Recommendations for white noise machines that don\'t sound "tinny"?',
    tags: ["Hardware", "Sleep Hygiene"],
    voices: 24,
    latest: "2m ago",
  },
  {
    id: "t2",
    title: "Landlord refusing to repair old radiator (clanging at 4 AM)",
    tags: ["Legal", "Maintenance"],
    voices: 156,
    latest: "18m ago",
  },
  {
    id: "t3",
    title: "Do acoustic panels actually work on thin dry-wall?",
    tags: ["DIY", "Isolation"],
    voices: 89,
    latest: "1h ago",
  },
  {
    id: "t4",
    title: "Looking for a Noise Log partner in San Francisco",
    tags: ["Local Hub"],
    voices: 8,
    latest: "4h ago",
  },
];

export default function ForumBoard() {
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [topics, query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    const newTopic: Topic = {
      id: `t-${Date.now()}`,
      title: title.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      voices: 1,
      latest: "just now",
    };
    setTopics((prev) => [newTopic, ...prev]);
    setTitle("");
    setTags("");
    setFormOpen(false);
  };

  return (
    <section className="mb-section-gap" id="community">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary uppercase tracking-widest mb-2">
            Recent Discussions
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Engage with 12,000+ members in the NoisyApartment forum.
          </p>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="bg-white walnut-border px-6 py-2 font-label-sm uppercase tracking-widest text-primary hover:bg-surface-container-low transition-all active:scale-95"
        >
          {formOpen ? "Cancel" : "New Topic"}
        </button>
      </div>

      <div className="flex items-center gap-2 bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 mb-6 max-w-md">
        <Search size={16} className="text-on-surface-variant" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search discussions or tags…"
          className="bg-transparent outline-none font-body-md text-sm flex-1"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="text-on-surface-variant hover:text-primary"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="walnut-border p-6 mb-6 space-y-4 bg-surface-container-low"
        >
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What's your question or story?"
            className="w-full bg-background border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-body-md text-sm transition-colors"
          />
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Tags (comma separated, e.g. Legal, DIY)"
            className="w-full bg-background border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-body-md text-sm transition-colors"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
          >
            Post Topic
          </button>
        </form>
      )}

      <div className="walnut-border overflow-hidden">
        <div className="hidden md:grid bg-surface-container-low border-b border-outline-variant/30 grid-cols-12 px-8 py-4 font-label-sm text-label-sm text-outline uppercase">
          <div className="col-span-8">Topic</div>
          <div className="col-span-2 text-center">Voices</div>
          <div className="col-span-2 text-right">Latest</div>
        </div>
        {filtered.length === 0 ? (
          <p className="px-8 py-10 text-center font-body-md text-on-surface-variant">
            No discussions match “{query}”.
          </p>
        ) : (
          filtered.map((topic, i) => (
            <div
              key={topic.id}
              className={`grid grid-cols-12 px-8 py-6 items-center hover:bg-surface-container-low transition-all group cursor-pointer ${
                i < filtered.length - 1 ? "border-b border-outline-variant/20" : ""
              }`}
            >
              <div className="col-span-12 md:col-span-8">
                <h5 className="font-body-lg font-bold text-primary group-hover:text-secondary transition-colors">
                  {topic.title}
                </h5>
                <p className="text-sm text-on-surface-variant mt-1">
                  Tags:{" "}
                  {topic.tags.map((tag, idx) => (
                    <span key={tag} className="text-primary/70">
                      {tag}
                      {idx < topic.tags.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
              <div className="col-span-6 md:col-span-2 text-left md:text-center font-headline-md text-primary mt-2 md:mt-0">
                {topic.voices}
              </div>
              <div className="col-span-6 md:col-span-2 text-right text-sm text-outline mt-2 md:mt-0">
                {topic.latest}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
