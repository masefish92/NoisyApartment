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
          {/* TODO: replace with the real author bio — name, relevant
              background/credentials (e.g. acoustics, construction, tenant
              law, journalism), and how long they've covered this topic. Do
              not publish this page without real, verifiable information. */}
          [TODO: Author bio goes here. Name, background, and relevant
          experience or credentials.]
        </p>
      </section>

      <section className="mb-12 border-l-4 border-secondary bg-surface-container-low p-8">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          How We Research &amp; Test
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {/* TODO: describe the actual research/testing process — e.g. hands-on
              product testing, decibel measurements, cited acoustics research,
              interviews with tenants/contractors/lawyers. Be specific and
              truthful; do not invent a process that isn't real. */}
          [TODO: Describe how guides are researched, fact-checked, and (if
          applicable) how products are tested before being recommended.]
        </p>
      </section>

      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Corrections &amp; Feedback
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          We update guides when we learn something new or when a reader spots
          an error. If something on this site is inaccurate or out of date,{" "}
          {/* TODO: replace with a real contact method */}
          [TODO: add a contact email or form] and we&apos;ll look into it.
        </p>
      </section>
    </div>
  );
}
