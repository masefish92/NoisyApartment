export type CategoryGroup = "source" | "room" | "resource";

export type Category = {
  slug: string;
  label: string;
  group: CategoryGroup;
  description: string;
};

/**
 * Single source of truth for the site's topic taxonomy. Homepage nav,
 * category routes, and article frontmatter validation all read from this
 * list — add a category here before any article/nav can reference it.
 */
export const CATEGORIES: Category[] = [
  // By noise source
  {
    slug: "upstairs-neighbors",
    label: "Upstairs Neighbors",
    group: "source",
    description: "Footsteps, dragging furniture, and impact noise from the unit above you.",
  },
  {
    slug: "wall-neighbors",
    label: "Wall Neighbors",
    group: "source",
    description: "Voices, TVs, and bass bleeding through a shared wall.",
  },
  {
    slug: "street-traffic",
    label: "Street & Traffic Noise",
    group: "source",
    description: "Cars, sirens, and city noise leaking in through windows and walls.",
  },
  {
    slug: "barking-dog",
    label: "Barking Dogs",
    group: "source",
    description: "Neighbor pets, hallway barking, and how to address it without conflict.",
  },
  // By room
  {
    slug: "doors",
    label: "Doors",
    group: "room",
    description: "Sealing gaps and dampening sound that travels through doorways.",
  },
  {
    slug: "walls",
    label: "Walls",
    group: "room",
    description: "Adding mass and absorption to shared or thin walls.",
  },
  {
    slug: "windows",
    label: "Windows",
    group: "room",
    description: "Blocking outside noise at the weakest point in most apartments.",
  },
  {
    slug: "floors",
    label: "Floors",
    group: "room",
    description: "Reducing impact noise you send down, and noise you receive from below.",
  },
  {
    slug: "home-office",
    label: "Home Office",
    group: "room",
    description: "Creating a quiet, focus-friendly workspace in a shared living space.",
  },
  // Cross-cutting content that isn't tied to one noise source or room
  {
    slug: "resources",
    label: "Tools & Resources",
    group: "resource",
    description: "Product roundups, templates, and tenant-rights help that apply no matter what's causing the noise.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getCategoriesByGroup(group: CategoryGroup): Category[] {
  return CATEGORIES.filter((category) => category.group === group);
}
