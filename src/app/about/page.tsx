import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | NoisyApartment",
  description:
    "Who writes NoisyApartment's guides, and how we research and test what we recommend.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-10">
        About NoisyApartment
      </h1>

      <section className="mb-12">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Our Mission
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          NoisyApartment publishes free, practical guides for renters and
          condo owners dealing with apartment noise — noisy neighbors, thin
          walls, street noise, and everything in between. We organize advice
          by noise source and by room so you can find a fix for your specific
          problem quickly, without having to buy anything first.
        </p>
      </section>

      <section className="mb-12 border-l-4 border-secondary bg-surface-container-low p-8">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Who Writes These Guides
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Marcus M. writes and researches the guides on NoisyApartment. His
          background is in finance and audit, not acoustics — this site
          started because his own apartment had a noise problem he couldn&apos;t
          afford to ignore, and the research he did to fix it became the
          foundation for what&apos;s published here.
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mt-4">
          These guides are written from firsthand experience, not just
          research. Marcus has lived in apartments for over 14 years, across
          major markets including California and Seattle, so he&apos;s dealt
          with nearly every kind of shared-wall noise problem this site
          covers, and he currently owns an apartment in Hawaii near Ward
          Village. That combination of long-term renting and ownership
          experience across very different building types and cities is
          what shapes the practical, renter-safe advice in these guides:
          what actually works, what&apos;s a waste of money, and what to try
          first.
        </p>
      </section>

      <section className="mb-12 border-l-4 border-secondary bg-surface-container-low p-8">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          How We Research &amp; Test
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Our recommendations come from more than product research.
          We&apos;ve spoken directly with other apartment neighbors dealing
          with the same noise problems to understand what actually worked
          for them, and we&apos;ve personally used many of the products we
          recommend ourselves before including them here. If something
          didn&apos;t work in practice, it doesn&apos;t make the list.
        </p>
      </section>

      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Corrections &amp; Feedback
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          We update guides when we learn something new or when a reader spots
          an error. If something on this site is inaccurate or out of date,
          email{" "}
          <a href="mailto:marcus@noisyapartment.org" className="text-primary underline">
            marcus@noisyapartment.org
          </a>{" "}
          and we&apos;ll look into it.
        </p>
      </section>
    </div>
  );
}
