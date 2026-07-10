import Image from "next/image";
import Link from "next/link";
import { AudioLines, Layers, TrendingDown } from "lucide-react";
import SolutionsParallax from "@/components/SolutionsParallax";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Noise Solutions Guide",
  description:
    "Bridging 1950s architectural wisdom and modern acoustic science to help you build a quieter home.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <SolutionsParallax />

      {/* Hero */}
      <section className="py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-gutter">
          <div className="md:col-span-7">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
              Mastering the <br />
              <span className="text-secondary italic">Acoustics</span> of Home.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Urban living doesn&apos;t have to be loud. We bridge the gap
              between 1950s architectural wisdom and modern acoustic science
              to help you build a quieter home.
            </p>
            <div className="flex flex-wrap gap-4">
              {["01. Science", "02. Architecture", "03. Design"].map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-2 font-label-sm text-label-sm uppercase text-primary"
                >
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-5 relative h-96 w-full rounded-xl overflow-hidden border border-outline-variant">
            <div className="absolute inset-0 bg-secondary-container opacity-10" />
            <div className="absolute bottom-6 left-6 bg-white p-4 border border-outline hard-shadow">
              <p className="font-label-sm text-label-sm uppercase text-primary tracking-widest">
                Live Feed: Decibel Delta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Science of Silence */}
      <section className="bg-surface-container py-section-gap border-t border-outline-variant -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4">
              Phase One
            </p>
            <h2 className="font-display-lg text-display-lg text-primary">
              The Science of Silence
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant md:w-1/3 italic border-l-2 border-secondary pl-6">
            &ldquo;Sound is not just noise; it is energy seeking a path.
            Understanding the wave is the first step to dampening the
            echo.&rdquo;
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-background p-8 border border-outline-variant hard-shadow group hover:-translate-y-1 transition-transform">
            <div className="h-48 mb-8 bg-surface-container-low flex items-center justify-center overflow-hidden">
              <AudioLines className="text-tertiary/40" size={56} />
            </div>
            <h3 className="font-headline-md text-headline-md text-tertiary mb-4">
              Waveform Attenuation
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              How sound energy is converted into microscopic amounts of heat
              as it passes through porous materials.
            </p>
          </div>
          <div className="bg-background p-8 border border-outline-variant hard-shadow group hover:-translate-y-1 transition-transform">
            <div className="relative h-48 mb-8 bg-surface-container-low overflow-hidden">
              <Image
                fill
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUScbgBuY2V17GzJcZdkUKSYbtS-Wcu4adQ-C0KN97wlZ0gz4gdwhpUHSSBlAXANKh1SXWezV93XVKoQ3zXSBKWlGPkbUL_fpjyKlocsPAQN7cTZnWapHffVOUZ1M61-d4rUuxiYiIuls-068vHIjKTJW63ZvLGcF5Hu08XZEM3UKnvHgPsLR-VC86p9VaI0-warGDb8lh_fTFrW04QxfWgA7H1Kx75jyilRiZUQnjirUFkZ1QZ5JF"
                alt="Architectural diagram showing sound waves reflecting off a hard wall versus being absorbed by a textured acoustic panel."
              />
            </div>
            <h3 className="font-headline-md text-headline-md text-tertiary mb-4">
              Reflection vs. Diffusion
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Hard surfaces reflect noise like a mirror, while uneven textures
              break waves apart, preventing standing echoes.
            </p>
          </div>
          <div className="bg-background p-8 border border-outline-variant hard-shadow group hover:-translate-y-1 transition-transform">
            <div className="h-48 mb-8 bg-surface-container-low flex items-center justify-center overflow-hidden">
              <TrendingDown className="text-tertiary/40" size={56} />
            </div>
            <h3 className="font-headline-md text-headline-md text-tertiary mb-4">
              The Decibel Scale
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Visualizing logarithmic growth in noise levels and why reducing
              just 3dB effectively halves the sound pressure.
            </p>
          </div>
        </div>
      </section>

      {/* Acoustic Architecture (Bento Grid) */}
      <section className="py-section-gap bg-background">
        <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4">
          Phase Two
        </p>
        <h2 className="font-display-lg text-display-lg text-primary mb-16">
          Acoustic Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Seal the Gaps */}
          <div className="col-span-1 md:col-span-4 flex flex-col border border-outline-variant">
            <div className="relative h-80">
              <Image
                fill
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi0uCnhesbHmzAY2vHOutaq3yHbYuTst2A3kiaoGCPTQO_p492wOcw_uN8Q-cT5UOXVwBiaejaFkftlZqnJnnpP_R8cPyHSS3R9BJqi-XSBxpLGRR3zNbaL6j1h4aX3ax9JCNNzphsI8R4RHsvBDUBcvrFxSkpZACcnAobni3jWS8Oin6Le0HcTj2ueCHSF7Tb_9VYmi8iV4adhaCOB8OHwkZPP9GsRNIrD0fcGvYFGLmxlMXLyVHx"
                alt="Weatherstripping being applied to a vintage wooden door frame."
              />
            </div>
            <div className="p-8 bg-surface-container-low flex-grow">
              <h4 className="font-headline-md text-headline-md text-primary mb-2">
                Seal the Gaps
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Weatherstripping windows and door frames stops air-borne noise
                at the source.
              </p>
              <div className="mt-6">
                <Link
                  href="/guides/apartment-noise"
                  className="font-label-sm text-label-sm text-secondary uppercase border-b-2 border-secondary"
                >
                  View Guide
                </Link>
              </div>
            </div>
          </div>

          {/* Heavy Curtains */}
          <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 border border-outline-variant bg-surface-container-low">
            <div className="p-8 flex flex-col justify-center">
              <h4 className="font-headline-md text-headline-md text-primary mb-2">
                The Heavy Veil
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Velvet or thick-weave curtains don&apos;t just block light;
                they act as a massive sound trap for high-frequency street
                noise.
              </p>
              <ul className="space-y-3">
                {["Weighted Hems", "Triple-Weave Fabric", "Floor-to-Ceiling Coverage"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 font-body-md text-body-md text-tertiary"
                    >
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="relative min-h-[300px]">
              <Image
                fill
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLc8Anj_7YFHNi9vksUNrFranjE6X67xyzdw_8jFQyJbpwZUTSAz27BG7w5v3jD_FOYkdzV7x5tSCAF1cXIrAEGbeGOAM4p5S3F5iw0ytkA5ZhOU4K5ygInEVPa20l-9Bl7s4Bl-3JXMHUjrYt0RFo48cdUUDUjgS9RbCGymh5ExMKoBxxr1eFsjuwscx4OFxrgsFpGUFxvBx4r2SRwwV2sydjYQcn9QpeNw8a5iKZT43SsfUGYISA"
                alt="Deep teal velvet curtains hanging in a mid-century modern apartment."
              />
            </div>
          </div>

          {/* Stratified Sub-floors */}
          <div className="col-span-1 md:col-span-6 p-8 border border-outline-variant flex gap-6 items-center">
            <div className="w-24 h-24 shrink-0 bg-primary-fixed rounded-lg flex items-center justify-center text-primary">
              <Layers size={40} />
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-primary mb-1">
                Stratified Sub-floors
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Adding mass-loaded vinyl beneath hardwood reduces impact noise
                from footsteps by 40%.
              </p>
            </div>
          </div>

          {/* Callout */}
          <div className="col-span-1 md:col-span-6 border border-outline-variant bg-tertiary-container text-white relative overflow-hidden flex items-center justify-center min-h-[220px]">
            <div className="absolute inset-0 bg-tertiary opacity-80" />
            <div className="relative z-10 p-8 border border-white/20 m-4 w-full h-full flex flex-col justify-center items-center text-center">
              <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] mb-4">
                Free Resource
              </p>
              <h3 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-6">
                Want the full room-by-room breakdown?
              </h3>
              <Link
                href="/guides/apartment-noise"
                className="inline-block border-2 border-white text-white px-8 py-3 font-label-sm text-label-sm uppercase hover:bg-white hover:text-tertiary transition-all"
              >
                Read the Complete Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Divider */}
      <div className="w-full flex items-center justify-center py-12 gap-8 opacity-20">
        <div className="h-px bg-tertiary flex-grow max-w-[200px]" />
        <span className="font-label-sm text-tertiary uppercase tracking-widest">
          NoisyApartment
        </span>
        <div className="h-px bg-tertiary flex-grow max-w-[200px]" />
      </div>
    </div>
  );
}
