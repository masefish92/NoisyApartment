import Link from "next/link";
import { Globe, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-high border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-12 flex flex-col md:flex-row justify-between items-center gap-gutter">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <span className="font-headline-md text-headline-md text-tertiary">
            NoisyApartment
          </span>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            © {new Date().getFullYear()} NoisyApartment
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link
            className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            href="/guides/apartment-noise"
          >
            Guides
          </Link>
          <Link
            className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            href="/solutions"
          >
            Acoustic Science
          </Link>
          <Link
            className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            href="/community#rights"
          >
            Tenant Rights
          </Link>
          <Link
            className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            href="/community"
          >
            Community
          </Link>
          <Link
            className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            href="/about"
          >
            About
          </Link>
        </div>
        <div className="flex gap-4">
          <a
            className="w-10 h-10 border border-outline flex items-center justify-center hover:bg-secondary-container transition-colors"
            href="#"
            aria-label="Share"
          >
            <Share2 size={18} className="text-tertiary" />
          </a>
          <a
            className="w-10 h-10 border border-outline flex items-center justify-center hover:bg-secondary-container transition-colors"
            href="#"
            aria-label="Website"
          >
            <Globe size={18} className="text-tertiary" />
          </a>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-8">
        <p className="text-center md:text-left font-body-md text-xs text-on-surface-variant border-t border-outline-variant/40 pt-6">
          NoisyApartment is supported by advertising and affiliate links. See
          our{" "}
          <Link href="/disclosure" className="underline hover:text-primary">
            disclosure
          </Link>{" "}
          for details.
        </p>
      </div>
    </footer>
  );
}
