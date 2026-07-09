import Link from "next/link";
import type { Metadata } from "next";
import { getAllStates, getJurisdictionIndex } from "@/lib/noise-law";
import NoiseLawLookup from "@/components/NoiseLawLookup";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";
import { SITE_CONFIG } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "US Noise Ordinances & Tenant Quiet-Hours Laws by State & City",
  description:
    "Look up quiet hours, decibel limits, and tenant quiet-enjoyment rights for your state and city, with citations to the actual ordinance or statute.",
  path: "/noise-laws",
});

export default function NoiseLawsHubPage() {
  const states = getAllStates();
  const index = getJurisdictionIndex();
  const pageUrl = `${SITE_CONFIG.siteUrl}/noise-laws`;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Noise Laws", url: pageUrl },
        ]}
      />
      <SoftwareApplicationSchema
        name="Noise Law Lookup"
        description="Look up quiet hours, decibel limits, and the governing noise ordinance for a US city or state, with a source citation for every claim."
        url={pageUrl}
      />

      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 max-w-2xl">
        Noise Ordinances &amp; Tenant Rights by State &amp; City
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">
        Quiet hours, decibel limits where they&apos;re actually defined, who
        enforces them, and the governing statute or ordinance — with a
        citation and source link for every claim, so you can verify it
        yourself.
      </p>

      <div className="mb-16">
        <NoiseLawLookup index={index} />
      </div>

      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-2">
          All 50 States
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant mb-6">
          We&apos;ve fully researched and cited a handful of states so far —
          the rest have a page with general guidance while research is in
          progress.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl">
          {states.map((state) => (
            <li key={state.stateSlug}>
              <Link
                href={`/noise-laws/${state.stateSlug}`}
                className="flex items-center justify-between gap-3 border border-outline-variant bg-background px-5 py-3 font-body-md text-sm hover:border-primary transition-colors"
              >
                <span>{state.state}</span>
                <span
                  className={`font-label-sm text-[10px] uppercase tracking-widest shrink-0 ${
                    state.verified ? "text-secondary" : "text-on-surface-variant"
                  }`}
                >
                  {state.verified ? "Verified" : "Under review"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
