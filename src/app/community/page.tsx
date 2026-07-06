import { FileText, Gavel, Volume2 } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Rights & Legal Guide | NoisyApartment",
  description:
    "A primer on tenant laws, quiet-enjoyment rights, and how to document a noise complaint.",
};

const LEGAL_ITEMS = [
  {
    icon: Gavel,
    title: "The Covenant of Quiet Enjoyment",
    description:
      'Almost every lease includes this implied promise. It doesn\'t mean "silence"—it means you have the right to use your property without unreasonable interference.',
    cta: "See Case Law →",
  },
  {
    icon: Volume2,
    title: "Decibel Thresholds vs. Nuisance",
    description:
      "Most cities define 55dB (day) and 45dB (night) as the limits. But even quiet sounds can be a \"nuisance\" if they are persistent and avoidable.",
    cta: "Local Decibel Maps →",
  },
  {
    icon: FileText,
    title: "Effective Documentation",
    description:
      'Recording sound on a phone isn\'t always enough. Learn how to keep a legally-admissible "Noise Log" that identifies frequency, duration, and impact.',
    cta: "Download Log Sheet →",
  },
];

export default function CommunityPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
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
            {LEGAL_ITEMS.map(({ icon: Icon, title, description, cta }) => (
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
                    href="#"
                  >
                    {cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="mb-section-gap flex flex-col items-center text-center">
        <div className="w-24 h-1 bg-secondary mb-8" />
        <h2 className="font-display-lg text-display-lg text-primary mb-4">
          Quiet in your inbox.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8">
          Subscribe to our monthly newsletter for practical legal tips and the
          latest in domestic acoustic tech.
        </p>
        <NewsletterForm variant="light" />
      </section>
    </div>
  );
}
