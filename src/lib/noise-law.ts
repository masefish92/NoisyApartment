import fs from "node:fs";
import path from "node:path";

const NOISE_LAW_DIR = path.join(process.cwd(), "content", "noise-law");
const STATES_DIR = path.join(NOISE_LAW_DIR, "states");
const CITIES_DIR = path.join(NOISE_LAW_DIR, "cities");

type Source = { label: string; url: string };

export type StateNoiseLaw = {
  type: "state";
  state: string;
  stateSlug: string;
  abbr: string;
  impliedWarrantyOfHabitability: {
    recognized: boolean;
    summary: string;
    statuteName?: string;
    statuteCitation?: string;
    sourceUrl?: string;
  };
  covenantOfQuietEnjoyment: {
    recognized: boolean;
    summary: string;
    statuteCitation?: string;
  };
  noticeToRemedy: {
    required: boolean;
    summary: string;
    statuteCitation?: string;
  };
  rentEscrowOrRepairDeduct: {
    available: boolean;
    summary: string;
  };
  lastVerified: string;
  sources: Source[];
  /** Research-team-only TODO_VERIFY flags — never rendered on the public page. */
  internalNotes?: string[];
};

export type CityNoiseLaw = {
  type: "city";
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  quietHours: {
    weekday?: string;
    weekend?: string;
    notes?: string;
  };
  decibelLimits: {
    hasNumericLimit: boolean;
    residentialDaytimeDb?: number;
    residentialNighttimeDb?: number;
    measurementNotes?: string;
  };
  ordinance: {
    name: string;
    citation: string;
    sourceUrl: string;
  };
  enforcement: {
    primary: string;
    secondary?: string;
    howToReport: string;
  };
  lastVerified: string;
  sources: Source[];
  /** Research-team-only TODO_VERIFY flags — never rendered on the public page. */
  internalNotes?: string[];
};

function readJsonFiles<T>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as T);
}

/** All seeded states, sorted alphabetically by name. */
export function getAllStates(): StateNoiseLaw[] {
  return readJsonFiles<StateNoiseLaw>(STATES_DIR).sort((a, b) =>
    a.state.localeCompare(b.state)
  );
}

export function getState(stateSlug: string): StateNoiseLaw | undefined {
  return getAllStates().find((state) => state.stateSlug === stateSlug);
}

/** All seeded cities across every state, sorted alphabetically by city name. */
export function getAllCities(): CityNoiseLaw[] {
  if (!fs.existsSync(CITIES_DIR)) return [];
  return fs
    .readdirSync(CITIES_DIR)
    .flatMap((stateSlug) => readJsonFiles<CityNoiseLaw>(path.join(CITIES_DIR, stateSlug)))
    .sort((a, b) => a.city.localeCompare(b.city));
}

export function getCitiesForState(stateSlug: string): CityNoiseLaw[] {
  return getAllCities().filter((city) => city.stateSlug === stateSlug);
}

export function getCity(stateSlug: string, citySlug: string): CityNoiseLaw | undefined {
  return getAllCities().find(
    (city) => city.stateSlug === stateSlug && city.citySlug === citySlug
  );
}

export type JurisdictionIndexEntry = {
  city: string;
  state: string;
  stateSlug: string;
  citySlug: string;
  path: string;
};

/** Prebuilt at build time and passed as a prop to NoiseLawLookup — never fetched client-side. */
export function getJurisdictionIndex(): JurisdictionIndexEntry[] {
  return getAllCities().map((city) => ({
    city: city.city,
    state: city.state,
    stateSlug: city.stateSlug,
    citySlug: city.citySlug,
    path: `/noise-laws/${city.stateSlug}/${city.citySlug}`,
  }));
}
