import Image from "next/image";
import Link from "next/link";
import { Building2, Car, Cpu, Mic, ArrowRight } from "lucide-react";
import GetCalmButton from "@/components/GetCalmButton";

const NOISE_SOURCES = [
  { icon: Car, label: "External Traffic" },
  { icon: Building2, label: "Structural Echo" },
  { icon: Cpu, label: "Appliance Hum" },
  { icon: Mic, label: "Ambient Voice" },
];

const TOOLKIT = [
  {
    tag: "Core Defense",
    title: "Acoustic Insulation",
    description:
      "Hidden panels and structural treatments that absorb low-frequency vibrations before they enter your space.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXhZBVn1pEIR2U1SdiBDOm29gVhfkKl1RUuj2zpOOPLO2jZ2s7XQpYJZLcZLfci9taVPz89GpeRYhdsywm6JWJIP8Ruq8yeQ9Cu7O3gzlyHxANQ91WerbYOk-wLZ7YzqQT827o1wK7EDAwyu6xaaNh7A5LOKZ23FddSyjSgQiCatKoU70bPQq4p9pKUYqICa5bQi6ECMDGyEKBzlGfbpG5nJabiVOPtauObsplx0cUoM7XOA6sOysd",
    alt: "Luxury acoustic insulation panels with a walnut wood slat finish against a dark teal wall.",
  },
  {
    tag: "Surface Softness",
    title: "Soft Surfaces",
    description:
      "Tactile textiles, heavy drapes, and high-density rugs designed to kill echo and provide visual warmth.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD39j2SJmbqMaa8FB27z_OhzW6Q758BebURfIr1VxPJXvJEu1HnHH-9DaTLr8JzA8Uv7n58F0ZmMtzudUP7AxLZfqXonsSBTZnqrFkOCQtmcBrQgLKdBeFGbnxoYuSFXRsSuxDI0vJVnxrDAhtA6JqqfwfGTKYmV4LCTPABLM7Yl9tqH8BPF-0LXsSR1Z6ZCuUZo6Zob5slFFWTQnejrw8QXBNLDy_pPlCmfbkXNPob-RlLYoHAKBx-",
    alt: "High-pile woven textile surfaces and heavy velvet curtains in muted mustard and brown.",
  },
  {
    tag: "Active Tech",
    title: "Smart Tech",
    description:
      "Active noise cancellation for the home environment. Intelligent soundscaping to mask unavoidable urban noise.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOAFLqPlqOt6B6f0pPxg4lncpEFXQZOz-pEOaO7WVJIjE7bEZWbpjfS-G5hLSoOyxWHxmyoc8vRy-IdQIFtG9zzU6rahLIhmvuEYrz-mLjJVVMs4AnEkGtOTwgocr0zPVBUEmy1JvWrpvv54M3apb3llRuxTYhQGjLvUk5l8i75_h_Ph9G7HyfpL6kex3xoHJJCLMcTWb3uoA3VtNL6B3GWa7GqBUdDVzqdwR01AgyV1nRpEhqonnc",
    alt: "Sleek minimalist smart home noise-canceling hub on a polished teak sideboard.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 pb-section-gap flex flex-col md:flex-row items-center gap-gutter">
          <div className="flex-1 space-y-8 z-10">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary max-w-xl">
              Find Silence in the City
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              Mid-century elegance meets modern acoustic science. Transform your
              urban dwelling into a sanctuary of stillness with our curated
              architectural solutions.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-block bg-primary text-on-primary px-10 py-4 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hard-shadow hover:translate-y-[-2px] transition-all"
              >
                Explore the Collection
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
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5">
            <h2 className="font-headline-md text-headline-md text-tertiary mb-6 uppercase tracking-wider">
              Addressing the Hum
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Urban living brings a constant rhythmic vibration—the distant
              siren, the hum of HVAC, the neighbor&apos;s heavy footsteps. These
              aren&apos;t just noises; they are disruptions to your biological
              rhythm.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Our philosophy of{" "}
              <span className="text-primary font-bold italic">
                Form Follows Function
              </span>{" "}
              dictates that a beautiful home must also be a quiet home. We
              identify acoustic leakages and neutralize them with materials
              that honor 1950s architectural integrity.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7 grid grid-cols-2 gap-4">
            {NOISE_SOURCES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-background p-6 border border-outline-variant flex flex-col items-center text-center"
              >
                <Icon className="text-secondary mb-3" size={36} strokeWidth={2} />
                <span className="font-label-sm text-label-sm uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Solutions */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
                The Quiet Toolkit
              </h2>
              <div className="h-1 w-24 bg-secondary" />
            </div>
            <p className="max-w-sm font-body-md text-on-surface-variant italic">
              Three layers of defense against the urban din, designed to
              disappear into your interior.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TOOLKIT.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col border border-outline-variant bg-white hover:border-primary transition-all duration-300"
              >
                <div className="h-64 overflow-hidden relative">
                  <Image
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={600}
                    height={400}
                    src={item.image}
                    alt={item.alt}
                  />
                  <div className="absolute top-4 left-4 bg-secondary-container px-3 py-1 font-label-sm text-label-sm uppercase tracking-tighter">
                    {item.tag}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-headline-md text-headline-md text-primary">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant h-24 overflow-hidden">
                    {item.description}
                  </p>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary group-hover:text-primary transition-colors"
                  >
                    LEARN MORE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-gap relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-5" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 border-2 border-secondary rounded-full opacity-10" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-8">
            Ready to rediscover calm?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
            Our team of acoustic architects is ready to evaluate your space.
            Silence isn&apos;t just an absence of noise—it&apos;s a luxury you
            can build.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-gutter">
            <GetCalmButton className="bg-primary text-on-primary px-12 py-5 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hard-shadow active:translate-y-[2px] transition-all" />
            <Link
              href="/shop"
              className="border-2 border-primary text-primary px-12 py-5 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-center"
            >
              View Catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
