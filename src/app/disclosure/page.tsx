import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclosure",
  description:
    "How NoisyApartment is funded: advertising, affiliate links, and our editorial policy.",
  path: "/disclosure",
});

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
          this site.
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
          Questions about this policy or anything else on the site? Email{" "}
          <a href="mailto:marcus@noisyapartment.org" className="text-primary underline">
            marcus@noisyapartment.org
          </a>
          .
        </p>
      </section>
    </div>
  );
}
