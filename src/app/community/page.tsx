import Link from "next/link";
import { ArrowRight, FileText, Gavel, Volume2 } from "lucide-react";
import DecibelReference from "@/components/DecibelReference";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import { SITE_CONFIG } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Tenant Rights & Legal Guide",
  description:
    "A primer on tenant laws, quiet-enjoyment rights, and how to document a noise complaint — plus free tools to diagnose your problem, check your state, and write a letter.",
  path: "/community",
});

const LEGAL_ITEMS = [
  {
    icon: Gavel,
    title: "The Covenant of Quiet Enjoyment",
    description:
      'Almost every lease includes this implied promise. It doesn\'t mean "silence"—it means you have the right to use your property without unreasonable interference.',
    cta: "Look Up Your State & City →",
    href: "/noise-laws",
  },
  {
    icon: Volume2,
    title: "Decibel Thresholds vs. Nuisance",
    description:
      "Most cities define 55dB (day) and 45dB (night) as the limits. But even quiet sounds can be a \"nuisance\" if they are persistent and avoidable.",
    cta: "See Decibel Reference →",
    href: "#decibels",
  },
  {
    icon: FileText,
    title: "Effective Documentation",
    description:
      'Recording sound on a phone isn\'t always enough. Learn how to keep a legally-admissible "Noise Log" that identifies frequency, duration, and impact.',
    cta: "Start Your Noise Log →",
    href: "/noise-log",
  },
];

export default function CommunityPage() {
  const pageUrl = `${SITE_CONFIG.siteUrl}/community`;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Community", url: pageUrl },
        ]}
      />
      {/* Hero */}
      <section className="py-section-gap">
        <div className="max-w-3xl">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            Tenant Rights, Noise Laws &amp; Free Complaint Tools
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-base">
            A primer on tenant rights and legal strategy for noise disputes.
            Whether you&apos;re fighting a faulty HVAC or a midnight drummer,
            know what you&apos;re actually entitled to before you escalate.
          </p>
        </div>
      </section>

      {/* Noise Diagnoser */}
      <section className="mb-section-gap" id="diagnose">
        <div className="bg-surface-container-low border border-outline-variant p-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Free Tool
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Answer a couple of quick questions and we&apos;ll point you to the
            right guides for your specific noise problem.
          </p>
          <Link
            href="/tools/noise-diagnoser"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all"
          >
            Diagnose Your Noise Problem <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Know Your Rights */}
      <section
        className="mb-section-gap bg-surface-container py-24 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop"
        id="rights"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-display-lg text-tertiary mb-4">
              Know Your Rights
            </h2>
            <p className="font-label-sm text-label-sm text-tertiary/70 uppercase tracking-widest">
              A Primer on Tenant Laws &amp; Ordinances
            </p>
          </div>
          <div className="space-y-8">
            {LEGAL_ITEMS.map(({ icon: Icon, title, description, cta, href }) => (
              <div
                key={title}
                className="bg-background p-8 walnut-border hard-shadow flex flex-col sm:flex-row gap-8 items-start hover:translate-y-[-4px] transition-transform"
              >
                <div className="bg-secondary-container p-3 rounded-sm flex items-center justify-center shrink-0">
                  <Icon className="text-on-secondary-fixed" size={28} />
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-primary mb-2">
                    {title}
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                    {description}
                  </p>
                  <a
                    className="text-secondary font-bold font-label-sm uppercase hover:text-primary transition-colors"
                    href={href}
                    {...(href.endsWith(".html")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Noise Laws by State & City */}
      <section className="mb-section-gap" id="state-rights">
        <div className="bg-surface-container-low border border-outline-variant p-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Free Tool
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Noise Laws by State &amp; City
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Quiet hours, decibel limits where they&apos;re actually defined,
            and the governing statute or ordinance — with a citation and
            source link for every claim.
          </p>
          <Link
            href="/noise-laws"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all"
          >
            Look Up Your State &amp; City <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Decibel Reference */}
      <section className="mb-section-gap" id="decibels">
        <div className="mb-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Reference
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            What the Decibel Levels Actually Mean
          </h2>
        </div>
        <DecibelReference />
      </section>

      {/* Letter Generator */}
      <section className="mb-section-gap" id="letter">
        <div className="bg-surface-container-low border border-outline-variant p-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Free Tool
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Noise Complaint Letter Generator
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Build a ready-to-send letter — a friendly neighbor note, a formal
            landlord complaint, or a written demand. Everything is assembled
            in your browser; nothing is stored or sent.
          </p>
          <Link
            href="/tools/complaint-letter-generator"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all"
          >
            Open the Letter Generator <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Noise Log Tool */}
      <section className="mb-section-gap" id="noise-log">
        <div className="mb-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Free Tool
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Noise Incident Log
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            A dated record is the single most useful thing you can bring to a
            landlord, a mediator, or small claims court. Log incidents as
            they happen and export a clean PDF or CSV whenever you need one
            — everything stays on your device.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/noise-log"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all"
          >
            Open the Noise Log Tool <ArrowRight size={16} />
          </Link>
          <a
            href="/noise-log.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-sm text-sm text-on-surface-variant underline hover:text-primary transition-colors"
          >
            Prefer pen and paper? Download the printable sheet
          </a>
        </div>
      </section>
    </div>
  );
}
