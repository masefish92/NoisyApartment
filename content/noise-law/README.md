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
can't confirm gets a `TODO_VERIFY: ...` string inside the relevant field's
text (each seeded file already has a few — grep for `TODO_VERIFY` to find
every open item) so it stays greppable rather than silently treated as
settled.

## Schema

See the `StateNoiseLaw` and `CityNoiseLaw` types in `src/lib/noise-law.ts`
for the authoritative shape. Every entry needs `lastVerified` (ISO date)
and a non-empty `sources` array.

## Seeded (5 states / 5 cities)

- [x] Washington — Seattle
- [x] California — Los Angeles
- [x] Texas — Austin
- [x] New York — New York City
- [x] Florida — Miami

## Remaining states + DC (not yet seeded — add a state file first, then at
least one city)

- [ ] Alabama
- [ ] Alaska
- [ ] Arizona
- [ ] Arkansas
- [ ] Colorado
- [ ] Connecticut
- [ ] Delaware
- [ ] District of Columbia
- [ ] Georgia
- [ ] Hawaii
- [ ] Idaho
- [ ] Illinois
- [ ] Indiana
- [ ] Iowa
- [ ] Kansas
- [ ] Kentucky
- [ ] Louisiana
- [ ] Maine
- [ ] Maryland
- [ ] Massachusetts
- [ ] Michigan
- [ ] Minnesota
- [ ] Mississippi
- [ ] Missouri
- [ ] Montana
- [ ] Nebraska
- [ ] Nevada
- [ ] New Hampshire
- [ ] New Jersey
- [ ] New Mexico
- [ ] North Carolina
- [ ] North Dakota
- [ ] Ohio
- [ ] Oklahoma
- [ ] Oregon
- [ ] Pennsylvania
- [ ] Rhode Island
- [ ] South Carolina
- [ ] South Dakota
- [ ] Tennessee
- [ ] Utah
- [ ] Vermont
- [ ] Virginia
- [ ] West Virginia
- [ ] Wisconsin
- [ ] Wyoming

This is a checklist for future research passes, not a promise that every
entry above is equally urgent — prioritize by traffic/renter population when
picking up the next batch.
