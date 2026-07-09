import Link from "next/link";
import type { Metadata } from "next";
import LetterGenerator from "@/components/LetterGenerator";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import { buildMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Free Noise Complaint Letter Generator for Renters",
  description:
    "Build a ready-to-send noise complaint letter — a friendly neighbor note, a formal landlord complaint, or a written demand — entirely in your browser.",
  path: "/tools/complaint-letter-generator",
});

const FAQ_ITEMS = [
  {
    question: "What kinds of letters can I generate?",
    answer:
      "Three: a friendly note to a neighbor, a formal complaint to a landlord or property manager, and a written demand that cites your right to quiet enjoyment.",
  },
  {
    question: "Is anything I type stored or sent anywhere?",
    answer:
      "No. The letter is assembled entirely in your browser from the options you pick — nothing is uploaded, stored, or emailed automatically. You copy or download the finished text yourself.",
  },
  {
    question: "Should I document incidents before sending a letter?",
    answer:
      "Yes, especially for a formal complaint or written demand. A dated record of when the noise happened strengthens the letter and gives a landlord or mediator something concrete to act on — use the Noise Log tool to build that record first.",
  },
  {
    question: "Does this letter have legal force on its own?",
    answer:
      "No — it's a communication tool, not legal advice. Pair it with your state's noise laws and quiet-enjoyment protections to understand what you're actually entitled to before escalating.",
  },
];

export default function ComplaintLetterGeneratorPage() {
  const pageUrl = `${SITE_CONFIG.siteUrl}/tools/complaint-letter-generator`;

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Complaint Letter Generator", url: pageUrl },
        ]}
      />
      <SoftwareApplicationSchema
        name="Noise Complaint Letter Generator"
        description="Builds a ready-to-send noise complaint letter — a friendly neighbor note, a formal landlord complaint, or a written demand — entirely in the browser."
        url={pageUrl}
      />
      <FAQSchema items={FAQ_ITEMS} />

      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
        Noise Complaint Letter Generator
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">
        Build a ready-to-send letter — a friendly neighbor note, a formal
        landlord complaint, or a written demand. Everything is assembled in
        your browser; nothing is stored or sent.
      </p>

      <LetterGenerator />

      <section className="mt-12 border-t border-outline-variant pt-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-6">
          Common Questions
        </h2>
        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <h3 className="font-headline-md text-headline-md text-[18px] text-primary mb-2">
                {item.question}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-12 font-body-md text-sm text-on-surface-variant border-t border-outline-variant pt-6">
        Document incidents first —{" "}
        <Link href="/noise-log" className="text-primary underline">
          start a Noise Log
        </Link>
        . Not sure this is the right move yet?{" "}
        <Link href="/tools/noise-diagnoser" className="text-primary underline">
          Diagnose your noise problem
        </Link>{" "}
        or{" "}
        <Link href="/noise-laws" className="text-primary underline">
          check your state&apos;s noise laws
        </Link>{" "}
        first.
      </p>
    </div>
  );
}
