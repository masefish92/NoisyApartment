import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import { getFeaturedArticles } from "@/lib/content";
import { getCategoriesByGroup, getCategory } from "@/lib/categories";

const HERO_CHIPS = getCategoriesByGroup("source");
const SOURCE_CATEGORIES = getCategoriesByGroup("source");
const ROOM_CATEGORIES = getCategoriesByGroup("room");

export default function HomePage() {
  const featuredArticles = getFeaturedArticles(3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 pb-section-gap flex flex-col md:flex-row items-center gap-gutter">
          <div className="flex-1 space-y-8 z-10">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary max-w-xl">
              Solve Your Apartment Noise Problem — Free
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              Practical, research-backed guides for renters and condo owners
              dealing with noisy neighbors, thin walls, and street noise. No
              products to buy — just fixes that work.
            </p>

            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-3">
                What noise problem are you dealing with?
              </p>
              <div className="flex flex-wrap gap-3">
                {HERO_CHIPS.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="rounded-full border border-outline px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/guides/apartment-noise"
                className="inline-block bg-primary text-on-primary px-10 py-4 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hard-shadow hover:translate-y-[-2px] transition-all"
              >
                Read the Complete Guide
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden hard-shadow border border-outline opacity-90">
              <Image
                className="w-full h-full object-cover"
                width={800}
                height={1000}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBvVt2qMOVqT_UkY9GZbJnvVyx5Jhbpfevt9pNkbocAX6j2PEB9lnjdnrGeWHhB4nDgJabLEtXl8dQvvGnZapmuQn8nDrIquklQ55tIPr9moIYuC21t3Ll3lByDZbrTNgvGqoecn9xfGaQ_uCnrC41-V5KdFpxyMR5rLbHsv-vk9mMylJgFee3l54vrXKy-qRYHEVrrw0MPo3Sf3EWU9pb4oaKoRhbAPtV5TdVO_T_oXLlDMrkagjA"
                alt="A serene mid-century modern living room with a walnut lounge chair, teak coffee table, and acoustic wall panels."
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-container rounded-lg -z-10 opacity-30" />
          </div>
        </div>
      </section>

      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="section-divider" />
      </div>

      {/* Addressing the Hum */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop max-w-3xl">
          <h2 className="font-headline-md text-headline-md text-tertiary mb-6 uppercase tracking-wider">
            Addressing the Hum
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            Urban living brings a constant rhythmic vibration—the distant
            siren, the hum of HVAC, the neighbor&apos;s heavy footsteps. These
            aren&apos;t just noises; they are disruptions to your sleep,
            focus, and peace of mind.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We publish free, practical guides that identify exactly where
            noise is getting into your space — and how to stop it, room by
            room, without spending a fortune.
          </p>
        </div>
      </section>

      {/* Problem-based navigation */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-16">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
              Find Your Fix
            </h2>
            <div className="h-1 w-24 bg-secondary" />
          </div>

          <div className="mb-16">
            <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-6">
              By Noise Source
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOURCE_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col justify-between border border-outline-variant bg-background p-6 hover:border-primary transition-colors"
                >
                  <div>
                    <h4 className="font-headline-md text-headline-md text-[18px] text-primary mb-2">
                      {category.label}
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      {category.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary group-hover:text-primary transition-colors">
                    See Guides <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-6">
              By Room
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ROOM_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col justify-between border border-outline-variant bg-background p-6 hover:border-primary transition-colors"
                >
                  <div>
                    <h4 className="font-headline-md text-headline-md text-[18px] text-primary mb-2">
                      {category.label}
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      {category.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary group-hover:text-primary transition-colors">
                    See Guides <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
                Popular Guides
              </h2>
              <div className="h-1 w-24 bg-secondary" />
            </div>
            <p className="max-w-sm font-body-md text-on-surface-variant italic">
              Our most-read, most-actionable guides to a quieter home.
            </p>
          </div>

          {featuredArticles.length === 0 ? (
            <p className="font-body-md text-on-surface-variant border border-outline-variant bg-background p-12 text-center">
              New guides are on the way — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col border border-outline-variant bg-white hover:border-primary transition-all duration-300 p-8"
                >
                  <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4">
                    {getCategory(article.category)?.label ?? article.category}
                  </p>
                  <h3 className="font-headline-md text-headline-md text-primary mb-4">
                    {article.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant mb-6">
                    {article.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary group-hover:text-primary transition-colors">
                    READ THE GUIDE <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-section-gap relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-5" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 border-2 border-secondary rounded-full opacity-10" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-8">
            Get free noise-fighting tips
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
            One email a month: new guides, tenant-rights updates, and the
            fixes that actually worked for other renters.
          </p>
          <div className="flex justify-center">
            <NewsletterForm variant="light" />
          </div>
        </div>
      </section>
    </>
  );
}
