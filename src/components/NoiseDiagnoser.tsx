"use client";

import { useState } from "react";
import Link from "next/link";

type GuideLink = {
  label: string;
  href: string;
};

const GUIDE_LINKS: Record<string, GuideLink> = {
  impactSoundproofing: {
    label: "Dealing with noisy upstairs neighbors",
    href: "/blog/noisy-upstairs-neighbors-stomping",
  },
  airborneWalls: {
    label: "Soundproofing a shared bedroom wall",
    href: "/blog/soundproof-bedroom-wall-no-damage",
  },
  bassNoise: {
    label: "Brown vs. white vs. pink noise for bass",
    href: "/blog/brown-white-pink-noise",
  },
  documentation: {
    label: "Documenting noise & building a paper trail",
    href: "/community#noise-log",
  },
  tenantRights: {
    label: "Tenant rights & quiet enjoyment",
    href: "/community#rights",
  },
  letter: {
    label: "Write a complaint letter",
    href: "/community#letter",
  },
  // TODO: no dedicated guide yet — the pillar's "barking dog" cluster
  // article hasn't been written. This category page already exists and
  // shows a real "coming soon" state, so it's the honest fallback rather
  // than pointing at an unrelated guide.
  petNoise: {
    label: "Handling neighbor pet noise",
    href: "/category/barking-dog",
  },
  whiteNoise: {
    label: "Masking noise with white noise & fixes you control",
    href: "/blog/best-white-noise-machines-apartment",
  },
};

type TreeOption = {
  label: string;
  next?: string;
  result?: string[];
};

type TreeNode = {
  q: string;
  options: TreeOption[];
};

const TREE: Record<string, TreeNode> = {
  start: {
    q: "Where is the noise coming from?",
    options: [
      { label: "Above me (ceiling)", next: "above" },
      { label: "Through a wall (next door)", next: "wall" },
      { label: "Outside / street / hallway", next: "outside" },
      { label: "Not sure", next: "unsure" },
    ],
  },
  above: {
    q: "What does it sound like most?",
    options: [
      {
        label: "Footsteps, thuds, furniture dragging",
        result: ["impactSoundproofing", "documentation"],
      },
      { label: "Music / TV / voices", result: ["airborneWalls", "letter"] },
      { label: "Bass you can feel", result: ["bassNoise", "documentation"] },
    ],
  },
  wall: {
    q: "What does it sound like most?",
    options: [
      { label: "Voices, TV, music", result: ["airborneWalls", "letter"] },
      { label: "A barking or whining pet", result: ["petNoise", "letter"] },
      { label: "Bass / low rumble", result: ["bassNoise", "airborneWalls"] },
    ],
  },
  outside: {
    q: "Is it something a neighbor or manager could address?",
    options: [
      { label: "Yes — a specific person or unit", result: ["tenantRights", "letter"] },
      { label: "No — traffic, city, general noise", result: ["whiteNoise", "airborneWalls"] },
    ],
  },
  unsure: {
    q: "When does it happen most?",
    options: [
      { label: "Late night / early morning", result: ["documentation", "tenantRights"] },
      { label: "Throughout the day", result: ["whiteNoise", "documentation"] },
    ],
  },
};

export default function NoiseDiagnoser() {
  const [node, setNode] = useState("start");
  const [path, setPath] = useState<string[]>([]);
  const [result, setResult] = useState<string[] | null>(null);

  function choose(opt: TreeOption) {
    setPath((p) => [...p, opt.label]);
    if (opt.result) {
      setResult(opt.result);
    } else if (opt.next) {
      setNode(opt.next);
    }
  }

  function reset() {
    setNode("start");
    setPath([]);
    setResult(null);
  }

  const current = TREE[node];

  return (
    <div className="border border-outline-variant bg-surface-container-low p-6 max-w-xl">
      {path.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {path.map((step, i) => (
            <span
              key={i}
              className="font-label-sm text-xs text-primary bg-secondary-container px-3 py-1 rounded-full"
            >
              {step}
            </span>
          ))}
        </div>
      )}

      {!result ? (
        <div>
          <h4 className="font-headline-md text-headline-md text-[18px] text-primary mb-4">
            {current.q}
          </h4>
          <div className="flex flex-col gap-3">
            {current.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => choose(opt)}
                className="text-left bg-background border border-outline-variant px-4 py-3 font-body-md text-sm hover:border-primary hover:bg-surface-container transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {opt.label}
              </button>
            ))}
          </div>
          {path.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="mt-4 font-label-sm text-sm text-on-surface-variant underline hover:text-primary transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      ) : (
        <div>
          <h4 className="font-headline-md text-headline-md text-[18px] text-primary mb-4">
            Start with these guides
          </h4>
          <ul className="space-y-2 mb-4">
            {result.map((key) => (
              <li key={key}>
                <Link
                  href={GUIDE_LINKS[key].href}
                  className="text-primary font-bold underline hover:text-secondary transition-colors"
                >
                  {GUIDE_LINKS[key].label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={reset}
            className="font-label-sm text-sm text-on-surface-variant underline hover:text-primary transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
