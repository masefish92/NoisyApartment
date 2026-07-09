import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCities, getCity, getState } from "@/lib/noise-law";
import Disclaimer from "@/components/Disclaimer";
import SourceLink from "@/components/SourceLink";
import LastVerified from "@/components/LastVerified";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import { SITE_CONFIG } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import type { CityNoiseLaw } from "@/lib/noise-law";

export async function generateStaticParams() {
  return getAllCities().map((city) => ({ state: city.stateSlug, city: city.citySlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  if (!city) return {};
  return buildMetadata({
    title: `${city.city}, ${city.state} Noise Ordinance & Quiet Hours Explained`,
    description: `Quiet hours, decibel limits, and how to report a noise complaint in ${city.city} — with the governing ordinance citation and source.`,
    path: `/noise-laws/${stateSlug}/${citySlug}`,
  });
}

function buildFaqItems(city: CityNoiseLaw) {
  const items: { question: string; answer: string }[] = [];

  if (city.quietHours.weekday || city.quietHours.weekend) {
    const parts = [
      city.quietHours.weekday && `Weekdays: ${city.quietHours.weekday}.`,
      city.quietHours.weekend && `Weekends: ${city.quietHours.weekend}.`,
      city.quietHours.notes,
    ].filter(Boolean);
    items.push({
      question: `What are quiet hours in ${city.city}?`,
      answer: parts.join(" "),
    });
  }

  if (city.decibelLimits.hasNumericLimit) {
    items.push({
      question: `What is the residential noise limit in ${city.city}?`,
      answer: `The daytime residential limit is ${city.decibelLimits.residentialDaytimeDb} dBA and the nighttime limit is ${city.decibelLimits.residentialNighttimeDb} dBA. ${city.decibelLimits.measurementNotes ?? ""}`.trim(),
    });
  }

  items.push({
    question: `What ordinance governs noise in ${city.city}?`,
    answer: `${city.ordinance.name} (${city.ordinance.citation}).`,
  });

  items.push({
    question: `How do I report a noise complaint in ${city.city}?`,
    answer: city.enforcement.howToReport,
  });

  return items;
}

export default async function CityNoiseLawPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  if (!city) notFound();
  const state = getState(stateSlug);

  const pageUrl = `${SITE_CONFIG.siteUrl}/noise-laws/${stateSlug}/${citySlug}`;
  const faqItems = buildFaqItems(city);

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Noise Laws", url: `${SITE_CONFIG.siteUrl}/noise-laws` },
          { name: city.state, url: `${SITE_CONFIG.siteUrl}/noise-laws/${stateSlug}` },
          { name: city.city, url: pageUrl },
        ]}
      />
      <FAQSchema items={faqItems} />

      <Link
        href={`/noise-laws/${stateSlug}`}
        className="font-label-sm text-label-sm uppercase tracking-widest text-secondary"
      >
        ← {city.state}
      </Link>
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 mb-4">
        {city.city} Noise Ordinance &amp; Quiet Hours
      </h1>
      <div className="mb-8">
        <LastVerified date={city.lastVerified} />
      </div>

      <Disclaimer />

      <div className="space-y-8 mb-12">
        <div>
          <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
            Quiet hours
          </h2>
          {city.quietHours.weekday || city.quietHours.weekend ? (
            <div className="font-body-md text-sm text-on-surface-variant space-y-1">
              {city.quietHours.weekday && <p>Weekdays: {city.quietHours.weekday}</p>}
              {city.quietHours.weekend && <p>Weekends: {city.quietHours.weekend}</p>}
              {city.quietHours.notes && <p>{city.quietHours.notes}</p>}
            </div>
          ) : (
            <p className="font-body-md text-sm text-on-surface-variant">
              No specific quiet-hours window has been confirmed for this city yet.
            </p>
          )}
        </div>

        <div>
          <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
            Decibel limits
          </h2>
          {city.decibelLimits.hasNumericLimit ? (
            <p className="font-body-md text-sm text-on-surface-variant">
              {city.decibelLimits.residentialDaytimeDb} dBA (day) /{" "}
              {city.decibelLimits.residentialNighttimeDb} dBA (night), residential.{" "}
              {city.decibelLimits.measurementNotes}
            </p>
          ) : (
            <p className="font-body-md text-sm text-on-surface-variant">
              {city.decibelLimits.measurementNotes ??
                "This city's ordinance doesn't set a single flat residential decibel number."}
            </p>
          )}
        </div>

        <div>
          <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
            Governing ordinance
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant">
            {city.ordinance.name} ({city.ordinance.citation})
          </p>
        </div>

        <div>
          <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
            Enforcement
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant">
            <span className="font-bold">{city.enforcement.primary}</span>
            {city.enforcement.secondary && <> · {city.enforcement.secondary}</>}
          </p>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            {city.enforcement.howToReport}
          </p>
        </div>
      </div>

      {city.sources.length > 0 && (
        <div className="mb-12">
          <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">
            Sources
          </h2>
          <ul className="space-y-2">
            {city.sources.map((source) => (
              <li key={source.url}>
                <SourceLink label={source.label} url={source.url} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {state && (
        <p className="font-body-md text-sm text-on-surface-variant border-t border-outline-variant pt-6">
          {city.city} sits under {state.state}&apos;s broader landlord-tenant
          law — see the{" "}
          <Link href={`/noise-laws/${stateSlug}`} className="text-primary underline">
            {state.state} state page
          </Link>{" "}
          for habitability and quiet-enjoyment protections that apply
          regardless of city.
        </p>
      )}

      {/* TODO: link to escalation pathway when Feature 2 ships */}
    </div>
  );
}
