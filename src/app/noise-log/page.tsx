import Link from "next/link";
import type { Metadata } from "next";
import NoiseLog from "@/components/NoiseLog";
import BreadcrumbListSchema from "@/components/schema/BreadcrumbListSchema";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";
import { SITE_CONFIG } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Noise Complaint Log — Track Incidents for Your Landlord or Court",
  description:
    "Log noise incidents with date, time, and detail, then export a clean PDF or CSV for your landlord, a mediator, or small claims — entirely in your browser, never uploaded.",
  path: "/noise-log",
});

export default function NoiseLogPage() {
  const pageUrl = `${SITE_CONFIG.siteUrl}/noise-log`;

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Noise Log", url: pageUrl },
        ]}
      />
      <SoftwareApplicationSchema
        name="Noise Incident Log"
        description="Logs noise incidents with date, time, and detail entirely in the browser, then exports a clean PDF or CSV for a landlord, mediator, or small claims filing. No account, no upload."
        url={pageUrl}
      />

      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
        Noise Incident Log
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">
        A dated, specific record is the single most useful thing you can
        bring to a landlord, a mediator, or small claims court. Log
        incidents as they happen and export a clean report whenever you
        need one.
      </p>

      <NoiseLog />

      <p className="mt-12 font-body-md text-sm text-on-surface-variant border-t border-outline-variant pt-6">
        Prefer pen and paper?{" "}
        <a
          href="/noise-log.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-secondary transition-colors"
        >
          Download the printable log sheet
        </a>{" "}
        instead. Once you have entries logged, our{" "}
        <Link href="/community#letter" className="text-primary underline">
          letter generator
        </Link>{" "}
        can reference them directly.
      </p>
    </div>
  );
}
