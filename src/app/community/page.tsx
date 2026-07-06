import { ArrowRight, FileText, Gavel, Volume2 } from "lucide-react";
import NoiseDiagnoser from "@/components/NoiseDiagnoser";
import StateRightsLookup from "@/components/StateRightsLookup";
import DecibelReference from "@/components/DecibelReference";
import LetterGenerator from "@/components/LetterGenerator";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Rights & Legal Guide | NoisyApartment",
  description:
    "A primer on tenant laws, quiet-enjoyment rights, and how to document a noise complaint — plus free tools to diagnose your problem, check your state, and write a letter.",
};

const LEGAL_ITEMS = [
  {
    icon: Gavel,
    title: "The Covenant of Quiet Enjoyment",
    description:
      'Almost every lease includes this implied promise. It doesn\'t mean "silence"—it means you have the right to use your property without unreasonable interference.',
    cta: "Check Your State →",
    href: "#state-rights",
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
    cta: "Download Log Sheet →",
    href: "/noise-log.html",
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
      <SoftwareApplicationSchema
        name="Noise Diagnoser"
        description="A short decision tree that routes visitors to the right noise-fighting guide based on where their noise problem is coming from."
        url={`${pageUrl}#diagnose`}
      />
      <SoftwareApplicationSchema
        name="Noise Complaint Letter Generator"
        description="Builds a ready-to-send noise complaint letter — a friendly neighbor note, a formal landlord complaint, or a written demand — entirely in the browser."
        url={`${pageUrl}#letter`}
      />
      <SoftwareApplicationSchema
        name="Tenant Noise Rights by State Lookup"
        description="A plain-English reference for tenant quiet-enjoyment rights, quiet hours, and how to report noise, by U.S. state."
        url={`${pageUrl}#state-rights`}
      />

      {/* Hero */}
      <section className="py-section-gap">
        <div className="max-w-3xl">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            Sounder Minds, <br />
            Shared Silence.
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
        <div className="mb-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Free Tool
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Answer a couple of quick questions and we&apos;ll point you to the
            right guides for your specific noise problem.
          </p>
        </div>
        <NoiseDiagnoser />
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
                    {...(href.startsWith("/noise-log")
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

      {/* State Rights Lookup */}
      <section className="mb-section-gap" id="state-rights">
        <div className="mb-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Free Tool
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Tenant Noise Rights by State
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            A plain-English starting point for the rules where you live.
          </p>
        </div>
        <StateRightsLookup />
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
        <div className="mb-8 max-w-2xl">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">
            Free Tool
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Noise Complaint Letter Generator
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Build a ready-to-send letter — a friendly neighbor note, a formal
            landlord complaint, or a written demand. Everything is assembled
            in your browser; nothing is stored or sent.
          </p>
        </div>
        <LetterGenerator />
      </section>

      {/* Printable Noise Log */}
      <section className="mb-section-gap" id="noise-log">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Printable Noise Log
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            A dated record is the single most useful thing you can bring to a
            landlord or mediator. Download the log, fill it in as incidents
            happen, and keep a copy.
          </p>
        </div>
        <a
          href="/noise-log.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all"
        >
          Open the Printable Noise Log <ArrowRight size={16} />
        </a>
      </section>
    </div>
  );
}
