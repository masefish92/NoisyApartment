import Image from "next/image";
import { FileText, Gavel, Volume2 } from "lucide-react";
import ForumBoard from "@/components/ForumBoard";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community & Legal Stories | NoisyApartment",
  description:
    "Legal strategy and neighborly wisdom for the NoisyApartment community.",
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
            Welcome to the NoisyApartment hub for legal strategy and neighborly
            wisdom. Whether you&apos;re fighting a faulty HVAC or a midnight
            drummer, you&apos;re not alone.
          </p>
        </div>
      </section>

      {/* Quiet Victories: Bento Grid */}
      <section className="mb-section-gap" id="victories">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-headline-md text-headline-md text-primary uppercase tracking-widest">
            Quiet Victories
          </h2>
          <div className="flex-grow h-px bg-outline-variant opacity-30" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="md:col-span-2 walnut-border p-8 flex flex-col justify-between group hover:bg-surface-container-low transition-all cursor-pointer">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="font-label-sm text-label-sm text-primary uppercase border border-primary px-2 py-1">
                  Solution
                </span>
                <span className="font-label-sm text-label-sm text-secondary uppercase border border-secondary px-2 py-1">
                  Success Story
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">
                The Case of the Vibrating Ceiling Fan
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                After three months of losing sleep to a neighbor&apos;s
                unbalanced industrial ceiling fan, Mark used our
                &ldquo;Acoustic Isolation&rdquo; toolkit to negotiate a fix. By
                identifying the specific resonance frequency, he provided data
                that the landlord couldn&apos;t ignore.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase">
                — Mark S., Chicago
              </span>
            </div>
          </div>
          <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <Image
              fill
              className="object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPpIHHDyasDgB4ITCrcBheWGJoReRI-EKuyug0HWaOGW-0EuJIXYkADzIlMbTd46u6JKOGte62uL5J1VWs0Mfbfq-t9F--lukqQXZ1Ur5dPSzVxUiC85fmEpADxPNY3NG8Qn_KUrO4uJeOB5MtWEIOhjIUpE0b-vzq4B0DE8iBROvR-scG9sXq9banjp_tTNYNEQX2ydXNfAZavMkuZKl3I07M_9WFAqJF3gA0evdhdgXt2rBGXFmP"
              alt="A serene sunlit mid-century modern apartment living room overlooking a quiet city street."
            />
          </div>
          <div className="walnut-border p-8 flex flex-col justify-between group hover:bg-surface-container-low transition-all cursor-pointer">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">
                Midnight Pianos
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4 italic">
                &ldquo;I didn&apos;t want to be &lsquo;that&rsquo; neighbor,
                but I needed to work.&rdquo;
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                How Sarah gifted her neighbor sound-dampening casters and
                saved their friendship.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-4">
              <span className="font-label-sm text-label-sm text-outline uppercase">
                — Sarah L., Brooklyn
              </span>
            </div>
          </div>
          <div className="md:col-span-2 walnut-border p-8 bg-secondary-container/10 flex flex-col md:flex-row gap-8 items-center group hover:bg-surface-container-low transition-all cursor-pointer">
            <div className="relative w-full md:w-1/3 aspect-square rounded-sm overflow-hidden shrink-0">
              <Image
                fill
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy8g-M8kqENEeruoxfHxrPa917f6dgY-CO76aD-by_aQdJjbA83DGwb7_D3djpymuSJM6yoUT5RqaMJqHzwsy9DeqftUop7GAXs0NULFn6pRfxp2b5Qk14nCkSJOahZ7XAJOTvCC08Hlw5qoJQXvC7vrVwY7MC5zxfpCr-6Wmnb63h4ze4w3_gEinNNdxQWn4g9mo8shLBlXWDVQleGFxf2YnID03qWWwsjZx1BlfVOf6UtfOX8OZB"
                alt="A vintage 1950s typewriter with ivory keys on a polished walnut desk."
              />
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-headline-md text-primary mb-4">
                Letter Templates that Work
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Download the exact wording Julian used to convince a corporate
                property manager to insulate a shared wall. No lawyers, just
                clear communication.
              </p>
            </div>
          </div>
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

      <ForumBoard />

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
