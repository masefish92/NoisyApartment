import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import NoiseDiagnoser from "@/components/NoiseDiagnoser";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import { buildMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Noise Problem Diagnoser — Find the Right Fix",
  description:
    "Answer a couple of quick questions and get routed straight to the right guide for your specific noise problem — upstairs neighbors, thin walls, or outside noise.",
  path: "/tools/noise-diagnoser",
});

const FAQ_ITEMS = [
  {
    question: "What does the Noise Problem Diagnoser do?",
    answer:
      "It's a short decision tree: you answer a couple of questions about where the noise is coming from and what it sounds like, and it points you to the specific guide (or tool) most likely to help.",
  },
  {
    question: "Do I need to enter any personal information?",
    answer:
      "No. Nothing you select is stored or sent anywhere — it's a client-side decision tree that just routes you to a page.",
  },
  {
    question: "What if my problem doesn't fit any of the options?",
    answer:
      "Pick the closest match, or choose \"Not sure\" — every path ends in at least one guide plus a link to document the noise, which is the right starting point for almost any dispute.",
  },
];

export default function NoiseDiagnoserPage() {
  const pageUrl = `${SITE_CONFIG.siteUrl}/tools/noise-diagnoser`;

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Noise Diagnoser", url: pageUrl },
        ]}
      />
      <SoftwareApplicationSchema
        name="Noise Diagnoser"
        description="A short decision tree that routes visitors to the right noise-fighting guide based on where their noise problem is coming from."
        url={pageUrl}
      />
      <FAQSchema items={FAQ_ITEMS} />

      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
        Not Sure Where to Start?
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">
        Answer a couple of quick questions and we&apos;ll point you to the
        right guides for your specific noise problem — no signup, nothing
        stored.
      </p>

      <Suspense fallback={null}>
        <NoiseDiagnoser />
      </Suspense>

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
        Already know the problem is documented and ongoing? Start a{" "}
        <Link href="/noise-log" className="text-primary underline">
          noise log
        </Link>{" "}
        or check{" "}
        <Link href="/noise-laws" className="text-primary underline">
          your state&apos;s noise laws
        </Link>{" "}
        directly.
      </p>
    </div>
  );
}
