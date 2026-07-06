/**
 * 100% client-side incident store. No network calls, ever — nothing in this
 * file should be modified to add one. IndexedDB is preferred for capacity and
 * robustness; if it's unavailable (older browsers, private/incognito modes
 * that disable it), everything falls back to a single localStorage key.
 */

export type NoiseType =
  | "footsteps"
  | "music_bass"
  | "voices_party"
  | "tv"
  | "pets"
  | "appliance_hvac"
  | "construction"
  | "other";

export type Incident = {
  id: string;
  dateTime: string; // ISO
  durationMinutes?: number;
  noiseType: NoiseType;
  decibelReading?: number; // manual entry only — never measured via device mic
  description: string;
  quietHoursViolation?: boolean;
};

export type LogMeta = {
  address?: string;
  unitOrLandlord?: string;
};

const DB_NAME = "noisyapartment-noise-log";
const STORE_NAME = "incidents";
const FALLBACK_KEY = "noisyapartment-noise-log-incidents";
const META_KEY = "noisyapartment-noise-log-meta";

function hasIndexedDB(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readFallback(): Incident[] {
  try {
    const raw = window.localStorage.getItem(FALLBACK_KEY);
    return raw ? (JSON.parse(raw) as Incident[]) : [];
  } catch {
    return [];
  }
}

function writeFallback(incidents: Incident[]): void {
  window.localStorage.setItem(FALLBACK_KEY, JSON.stringify(incidents));
}

export async function getAllIncidents(): Promise<Incident[]> {
  if (!hasIndexedDB()) return readFallback();
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result as Incident[]);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return readFallback();
  }
}

export async function addIncident(incident: Incident): Promise<void> {
  if (!hasIndexedDB()) {
    writeFallback([...readFallback(), incident]);
    return;
  }
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(incident);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    writeFallback([...readFallback(), incident]);
  }
}

export async function updateIncident(
  id: string,
  patch: Partial<Incident>
): Promise<void> {
  if (!hasIndexedDB()) {
    writeFallback(
      readFallback().map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
    );
    return;
  }
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const existing = getRequest.result as Incident | undefined;
        if (existing) store.put({ ...existing, ...patch });
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    writeFallback(
      readFallback().map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
    );
  }
}

export async function deleteIncident(id: string): Promise<void> {
  if (!hasIndexedDB()) {
    writeFallback(readFallback().filter((entry) => entry.id !== id));
    return;
  }
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    writeFallback(readFallback().filter((entry) => entry.id !== id));
  }
}

export async function clearAllIncidents(): Promise<void> {
  if (!hasIndexedDB()) {
    window.localStorage.removeItem(FALLBACK_KEY);
    return;
  }
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // fall through
  }
  window.localStorage.removeItem(FALLBACK_KEY);
}

/** Address/landlord fields for the PDF header — tiny, so plain localStorage is fine. */
export function getMeta(): LogMeta {
  try {
    const raw = window.localStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as LogMeta) : {};
  } catch {
    return {};
  }
}

export function setMeta(meta: LogMeta): void {
  window.localStorage.setItem(META_KEY, JSON.stringify(meta));
}
