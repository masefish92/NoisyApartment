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

## State legal research status (50 of 50 verified)

All 50 states now have real, citation-backed `verified: true` data for
implied warranty of habitability, covenant of quiet enjoyment, notice-to-
remedy, and rent escrow/repair-and-deduct (every state also has a page, so
no state page 404s or shows invented numbers). Seeded cities (5, one per
the first five verified states) are listed separately below.

- [x] Alabama
- [x] Alaska
- [x] Arizona
- [x] Arkansas
- [x] California
- [x] Colorado
- [x] Connecticut
- [x] Delaware
- [x] Florida
- [x] Georgia
- [x] Hawaii
- [x] Idaho
- [x] Illinois
- [x] Indiana
- [x] Iowa
- [x] Kansas
- [x] Kentucky
- [x] Louisiana
- [x] Maine
- [x] Maryland
- [x] Massachusetts
- [x] Michigan
- [x] Minnesota
- [x] Mississippi
- [x] Missouri
- [x] Montana
- [x] Nebraska
- [x] Nevada
- [x] New Hampshire
- [x] New Jersey
- [x] New Mexico
- [x] New York
- [x] North Carolina
- [x] North Dakota
- [x] Ohio
- [x] Oklahoma
- [x] Oregon
- [x] Pennsylvania
- [x] Rhode Island
- [x] South Carolina
- [x] South Dakota
- [x] Tennessee
- [x] Texas
- [x] Utah
- [x] Vermont
- [x] Virginia
- [x] Washington
- [x] West Virginia
- [x] Wisconsin
- [x] Wyoming

Seeded cities (state + city page both live): Washington (Seattle),
California (Los Angeles), Texas (Austin), New York (New York City),
Florida (Miami). The other 45 verified states currently have a state page
only — no city-level page yet.

State-level research is now complete for all 50 states. The natural next
expansion is city-level pages (`content/noise-law/cities/...`) for
high-renter-population metros beyond the 5 seeded ones — prioritize by
traffic/renter population. Every state file also carries `internalNotes`
with `TODO_VERIFY` flags from the research passes; grep `TODO_VERIFY`
across `content/noise-law/` to find open items worth a primary-source
recheck before treating specific citations as beyond dispute.
