# Noise law data

Structured, per-jurisdiction noise-law data powering `/noise-laws`. One JSON
file per state (`states/{state-slug}.json`) and one per seeded city
(`cities/{state-slug}/{city-slug}.json`). Loaded at build time by
`src/lib/noise-law.ts` — nothing here is fetched client-side.

## Accuracy rule (read before adding or editing a file)

Only set `decibelLimits.hasNumericLimit: true` and populate the numeric dB
fields when a real, cited ordinance value has been confirmed against a
primary source (the government/municipal-code site itself, not a
summarizer blog). If a city's noise code uses a formula instead of a flat
number (e.g. "ambient + 5 dBA") rather than actually stating one, that is
`hasNumericLimit: false` with the formula explained in `measurementNotes` —
do not back-calculate and present a derived number as if it were the quoted
figure. Never invent a citation, statute section, or URL. Any fact you
can't confirm gets a `TODO_VERIFY: ...` string appended to the top-level
`internalNotes` array — **never inside a `summary`/`notes`/`measurementNotes`
field**, since those render directly on the public page and a visitor
should never see raw research-tracking text. `internalNotes` is not
rendered anywhere; grep for `TODO_VERIFY` across `content/noise-law/` to
find every open item.

## Schema

See the `StateNoiseLaw` and `CityNoiseLaw` types in `src/lib/noise-law.ts`
for the authoritative shape. Every entry needs `lastVerified` (ISO date)
and a non-empty `sources` array.

## State legal research status (35 of 50 verified)

Every state has a page (all 50 got honest `verified: false` stubs in an
earlier pass so no state page 404s or shows invented numbers). This list
tracks which ones have real, citation-backed `verified: true` data for
implied warranty of habitability, covenant of quiet enjoyment, notice-to-
remedy, and rent escrow/repair-and-deduct. Seeded cities (5, one per the
first five verified states) are listed separately below.

- [x] Alabama
- [ ] Alaska
- [x] Arizona
- [ ] Arkansas
- [x] California
- [x] Colorado
- [ ] Connecticut
- [ ] Delaware
- [x] Florida
- [x] Georgia
- [x] Hawaii
- [ ] Idaho
- [x] Illinois
- [x] Indiana
- [x] Iowa
- [x] Kansas
- [x] Kentucky
- [x] Louisiana
- [ ] Maine
- [x] Maryland
- [x] Massachusetts
- [x] Michigan
- [x] Minnesota
- [ ] Mississippi
- [x] Missouri
- [ ] Montana
- [x] Nebraska
- [x] Nevada
- [ ] New Hampshire
- [x] New Jersey
- [x] New Mexico
- [x] New York
- [x] North Carolina
- [ ] North Dakota
- [x] Ohio
- [ ] Oklahoma
- [x] Oregon
- [x] Pennsylvania
- [ ] Rhode Island
- [x] South Carolina
- [ ] South Dakota
- [x] Tennessee
- [x] Texas
- [x] Utah
- [ ] Vermont
- [x] Virginia
- [x] Washington
- [ ] West Virginia
- [x] Wisconsin
- [ ] Wyoming

Seeded cities (state + city page both live): Washington (Seattle),
California (Los Angeles), Texas (Austin), New York (New York City),
Florida (Miami). The other 20 verified states currently have a state page
only — no city-level page yet.

This is a checklist for future research passes, not a promise that every
unchecked entry is equally urgent — prioritize by traffic/renter population
when picking up the next batch (e.g. Ohio-adjacent Midwest/Northeast states
and Nevada/Arizona-adjacent Southwest states cover a lot of remaining
renter population).
