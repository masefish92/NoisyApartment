import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStates, getState, getCitiesForState } from "@/lib/noise-law";
import Disclaimer from "@/components/Disclaimer";
import SourceLink from "@/components/SourceLink";
import LastVerified from "@/components/LastVerified";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import { SITE_CONFIG } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

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
  return buildMetadata({
    title: `${state.state} Noise Laws & Tenant Rights (Quiet Hours + Habitability)`,
    description:
      state.impliedWarrantyOfHabitability?.summary ??
      `Tenant rights, quiet-enjoyment protections, and how to document a noise complaint in ${state.state} — plus free tools to log incidents and write a complaint letter.`,
    path: `/noise-laws/${state.stateSlug}`,
  });
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
      {state.verified && state.lastVerified && (
        <div className="mb-8">
          <LastVerified date={state.lastVerified} />
        </div>
      )}

      <Disclaimer />

      {state.verified &&
      state.impliedWarrantyOfHabitability &&
      state.covenantOfQuietEnjoyment &&
      state.noticeToRemedy &&
      state.rentEscrowOrRepairDeduct ? (
        <>
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
        </>
      ) : (
        <div className="mb-12">
          <div className="border border-outline-variant bg-surface-container-low p-6 mb-8">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
              State specifics under review
            </p>
            <p className="font-body-md text-sm text-on-surface-variant">
              We haven&apos;t yet verified {state.state}&apos;s specific
              statutes, quiet-hours windows, or decibel limits against a
              primary source, so we&apos;re not publishing citations for this
              state until that research is done.
            </p>
          </div>

          <dl className="space-y-6">
            <LegalField label="Quiet enjoyment, generally">
              Almost every residential lease in the US includes an implied
              promise of quiet enjoyment. It doesn&apos;t mean &quot;silence&quot; —
              it means you have the right to use your property without
              unreasonable interference, and most states recognize some
              version of this right even where {state.state}&apos;s exact
              statutory language isn&apos;t confirmed here yet.
            </LegalField>
            <LegalField label="Finding your local ordinance">
              Noise ordinances are usually set at the city or county level,
              not the state level — search &quot;[your city] noise ordinance&quot;
              or check your city or county government website for quiet
              hours and decibel limits that apply to your address.
            </LegalField>
            <LegalField label="What to do in the meantime">
              Start documenting incidents with a dated record, and put your
              complaint in writing to your landlord or property manager —
              both matter regardless of which state or city you&apos;re in.
            </LegalField>
          </dl>
        </div>
      )}

      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-6">
          Cities in {state.state}
        </h2>
        {cities.length === 0 ? (
          <p className="font-body-md text-on-surface-variant border border-outline-variant p-8 text-center">
            City-level detail for {state.state} is on the way.
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

      <p className="mt-12 font-body-md text-sm text-on-surface-variant border-t border-outline-variant pt-6">
        Ready to escalate? Document what&apos;s happening with a{" "}
        <Link href="/noise-log" className="text-primary underline">
          noise log
        </Link>{" "}
        and use the{" "}
        <Link href="/tools/complaint-letter-generator" className="text-primary underline">
          complaint letter generator
        </Link>{" "}
        to put it in writing.
      </p>
    </div>
  );
}
