import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclosure | NoisyApartment",
  description:
    "How NoisyApartment is funded: advertising, affiliate links, and our editorial policy.",
};

export default function DisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-10">
        Disclosure
      </h1>

      <section className="mb-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Advertising
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          NoisyApartment is supported in part by display advertising served on
          this site.{" "}
          {/* TODO: name the ad network(s) once selected, e.g. "ads are served
              via Google AdSense." See src/lib/ads-config.ts. */}
          [TODO: name the ad network(s) once one is selected and configured.]
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Affiliate Links
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Some articles on this site contain affiliate links — if you click
          one and make a purchase, we may earn a commission at no extra cost
          to you. Articles that contain affiliate links carry a disclosure
          notice near the top of the page. Affiliate relationships never
          determine which products we recommend or how we describe them.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Editorial Independence
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Advertisers and affiliate partners have no input into our editorial
          content. We write about what we believe actually helps with
          apartment noise, whether or not it involves a product we link to.
        </p>
      </section>

      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Contact
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {/* TODO: add the legal entity name (if any) and a real contact
              method for FTC/legal correspondence. */}
          [TODO: add business/legal entity name and contact information.]
        </p>
      </section>
    </div>
  );
}
