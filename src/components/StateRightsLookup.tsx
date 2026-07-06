"use client";

import { useState } from "react";

/**
 * SEEDED with a handful of states as a starting point. These are general
 * educational descriptions, not statute text — verify and expand each entry
 * against the current statute/ordinance before treating as authoritative.
 */
type StateInfo = {
  name: string;
  quietEnjoyment: string;
  quietHours: string;
  reporting: string;
  note?: string;
};

const STATES: Record<string, StateInfo> = {
  CA: {
    name: "California",
    quietEnjoyment:
      "The implied covenant of quiet enjoyment applies to residential tenancies; landlords must not permit conditions that substantially interfere with a tenant's use of the unit.",
    quietHours:
      "No single statewide quiet-hours rule — quiet hours are set by city/county ordinance (commonly 10 PM–7 AM) and by lease terms.",
    reporting:
      "Notify the landlord in writing first. Local noise ordinances are typically enforced by city police or code enforcement. Persistent unresolved noise may support a habitability or quiet-enjoyment claim.",
    note: "Some cities (e.g., Los Angeles, San Francisco) have their own detailed noise ordinances with decibel limits.",
  },
  NY: {
    name: "New York",
    quietEnjoyment:
      "Every residential lease carries an implied warranty of habitability and covenant of quiet enjoyment; excessive noise a landlord fails to address can breach these.",
    quietHours:
      "New York City sets quiet hours and decibel-based limits under its Noise Code; other municipalities vary.",
    reporting:
      "In NYC, noise complaints go through 311; document dates/times. For landlord inaction, tenants may pursue remedies through housing court.",
    note: "NYC's Noise Code is unusually detailed, including specific limits for neighbor and construction noise.",
  },
  TX: {
    name: "Texas",
    quietEnjoyment:
      "Texas recognizes an implied covenant of quiet enjoyment in residential leases; landlords have a duty not to allow disturbances they can control.",
    quietHours:
      "No statewide quiet hours; set by municipal ordinance and lease. Many cities define nighttime hours around 10 or 11 PM.",
    reporting:
      "Report to the landlord in writing; local ordinances are enforced by city police/code enforcement. Texas Property Code governs lease remedies.",
    note: "Enforcement is heavily local — check your specific city's noise ordinance.",
  },
  FL: {
    name: "Florida",
    quietEnjoyment:
      "Florida law implies a right to quiet enjoyment; Chapter 83 (Residential Landlord and Tenant Act) governs the landlord-tenant relationship.",
    quietHours:
      "No uniform statewide quiet hours; counties and cities set their own, often 10 or 11 PM to 7 AM.",
    reporting:
      "Written notice to the landlord is the usual first step. Local code enforcement handles ordinance violations.",
    note: "Review your county ordinance — Florida enforcement varies widely between jurisdictions.",
  },
  WA: {
    name: "Washington",
    quietEnjoyment:
      "The Residential Landlord-Tenant Act (RCW 59.18) governs tenancies; the covenant of quiet enjoyment is recognized and landlords must not permit nuisances they can control.",
    quietHours:
      "No single statewide quiet-hours statute; cities (e.g., Seattle, Tacoma) set noise ordinances with defined nighttime limits.",
    reporting:
      "Give the landlord written notice. City noise ordinances are enforced locally; Seattle handles many complaints through its noise program.",
    note: "Seattle and Tacoma each have specific municipal noise codes worth checking directly.",
  },
  IL: {
    name: "Illinois",
    quietEnjoyment:
      "Illinois recognizes the implied covenant of quiet enjoyment; Chicago's Residential Landlord and Tenant Ordinance adds strong local tenant protections.",
    quietHours:
      "Chicago and other municipalities set their own quiet hours and decibel limits; no uniform statewide rule.",
    reporting:
      "In Chicago, complaints route through 311 and the RLTO framework; document and notify the landlord in writing.",
    note: "Chicago's RLTO is significantly more tenant-protective than default state law.",
  },
};

export default function StateRightsLookup() {
  const [code, setCode] = useState("");
  const data = code ? STATES[code] : null;

  return (
    <div>
      <label className="flex flex-col gap-2 max-w-sm">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
          Select your state
        </span>
        <select
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="bg-surface-container-low border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-body-md text-sm transition-colors"
        >
          <option value="">Choose a state…</option>
          {Object.entries(STATES).map(([stateCode, info]) => (
            <option key={stateCode} value={stateCode}>
              {info.name}
            </option>
          ))}
        </select>
      </label>

      {data && (
        <div className="mt-6 border border-outline-variant bg-surface-container-low p-6 max-w-2xl">
          <h4 className="font-headline-md text-headline-md text-primary mb-4">
            {data.name}
          </h4>
          <dl className="space-y-4">
            <div>
              <dt className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">
                Quiet enjoyment
              </dt>
              <dd className="font-body-md text-sm text-on-surface-variant">
                {data.quietEnjoyment}
              </dd>
            </div>
            <div>
              <dt className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">
                Quiet hours
              </dt>
              <dd className="font-body-md text-sm text-on-surface-variant">
                {data.quietHours}
              </dd>
            </div>
            <div>
              <dt className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">
                How to report
              </dt>
              <dd className="font-body-md text-sm text-on-surface-variant">
                {data.reporting}
              </dd>
            </div>
            {data.note && (
              <div>
                <dt className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">
                  Good to know
                </dt>
                <dd className="font-body-md text-sm text-on-surface-variant">
                  {data.note}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <p className="mt-6 font-body-md text-sm text-on-surface-variant">
        Educational summaries only — not legal advice, and not a substitute
        for the current statute or your local ordinance. Laws change and
        cities add their own rules; verify before you act. More states coming
        soon.
      </p>
    </div>
  );
}
