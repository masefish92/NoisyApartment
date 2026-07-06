import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStates, getState, getCitiesForState } from "@/lib/noise-law";
import Disclaimer from "@/components/Disclaimer";
import SourceLink from "@/components/SourceLink";
import LastVerified from "@/components/LastVerified";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import { SITE_CONFIG } from "@/config/site";

export async function generateStaticParams() {
  return getAllStates().map((state) => ({ state: state.stateSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) return {};
  return {
    title: `${state.state} Noise Laws & Tenant Rights (Quiet Hours + Habitability) | NoisyApartment`,
    description: state.impliedWarrantyOfHabitability.summary,
  };
}

function LegalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">
        {label}
      </dt>
      <dd className="font-body-md text-sm text-on-surface-variant">{children}</dd>
    </div>
  );
}

export default async function StateNoiseLawPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();

  const cities = getCitiesForState(slug);
  const pageUrl = `${SITE_CONFIG.siteUrl}/noise-laws/${slug}`;

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Noise Laws", url: `${SITE_CONFIG.siteUrl}/noise-laws` },
          { name: state.state, url: pageUrl },
        ]}
      />

      <Link
        href="/noise-laws"
        className="font-label-sm text-label-sm uppercase tracking-widest text-secondary"
      >
        ← All states
      </Link>
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 mb-4">
        {state.state} Noise Laws &amp; Tenant Rights
      </h1>
      <div className="mb-8">
        <LastVerified date={state.lastVerified} />
      </div>

      <Disclaimer />

      <dl className="space-y-6 mb-12">
        <LegalField label="Implied warranty of habitability">
          {state.impliedWarrantyOfHabitability.summary}
          {state.impliedWarrantyOfHabitability.statuteCitation && (
            <span className="block mt-1 font-bold">
              {state.impliedWarrantyOfHabitability.statuteName} (
              {state.impliedWarrantyOfHabitability.statuteCitation})
            </span>
          )}
        </LegalField>
        <LegalField label="Covenant of quiet enjoyment">
          {state.covenantOfQuietEnjoyment.summary}
        </LegalField>
        <LegalField label="Notice required before remedies">
          {state.noticeToRemedy.summary}
        </LegalField>
        <LegalField label="Rent escrow / repair-and-deduct">
          {state.rentEscrowOrRepairDeduct.summary}
        </LegalField>
      </dl>

      {state.sources.length > 0 && (
        <div className="mb-12">
          <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">
            Sources
          </h2>
          <ul className="space-y-2">
            {state.sources.map((source) => (
              <li key={source.url}>
                <SourceLink label={source.label} url={source.url} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-6">
          Cities in {state.state}
        </h2>
        {cities.length === 0 ? (
          <p className="font-body-md text-on-surface-variant border border-outline-variant p-8 text-center">
            City-level detail for {state.state} is coming soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cities.map((city) => (
              <li key={city.citySlug}>
                <Link
                  href={`/noise-laws/${state.stateSlug}/${city.citySlug}`}
                  className="block border border-outline-variant bg-background px-5 py-3 font-body-md text-sm hover:border-primary transition-colors"
                >
                  {city.city}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
