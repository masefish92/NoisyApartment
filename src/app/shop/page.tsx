import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import NewsletterForm from "@/components/NewsletterForm";
import { products } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | NoisyApartment",
  description: "Precision-engineered acoustic tools for a quieter apartment.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-6 space-y-base">
            <span className="font-label-sm text-secondary uppercase tracking-widest block mb-4">
              The Quiet Collection
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
              Tools for an <br />
              Audible Life.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-8">
              Precision-engineered solutions designed to reclaim your mental
              space. From mid-century inspired acoustic panels to
              state-of-the-art noise cancellation.
            </p>
          </div>
          <div className="md:col-span-6 relative group">
            <div className="aspect-[4/5] overflow-hidden rounded-xl border border-outline-variant transition-all group-hover:shadow-[4px_4px_0px_0px_rgba(81,54,45,0.2)]">
              <Image
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                width={800}
                height={1000}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3JktpdTGp0pS4M-K3oJAIbkjzJfh36-_n87LAPf1EuEl2jMRgO3lj5b-T1aNGK26Cx6C2hmSoOCXQwnJ88bd8ZdfuUyl07_d1oRcHHJKsfbrLFNQ91ZDa1QjKZPa3xqsJfd5K2q-q83g7bd_q94cgJXZc87Fd9wVGXZKK9YqfSIARAQmdQGofFba3P-lYt_V7ysFLLSpcPwSfLpBM4EVPMc_sYWuJQDNguOV7N7mKi7VS0mQPt2xN"
                alt="A pair of sleek matte-finish charcoal ANC headphones resting on a polished walnut table."
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-secondary-container p-6 rounded-lg hard-shadow hidden lg:block">
              <p className="font-headline-md text-on-secondary-container italic">
                &ldquo;Silence is luxury.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProductGrid products={products} initialQuery={q} />

      {/* Newsletter / CTA */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="bg-primary-container rounded-xl p-12 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display-lg text-display-lg text-on-primary-container mb-6">
              Master Your Environment.
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-10">
              Join 24,000 urban dwellers who receive our weekly curated guide
              on acoustic science, interior design, and the pursuit of peace.
            </p>
            <div className="flex justify-center">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
