"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import HeaderSearch from "@/components/HeaderSearch";

const NAV_LINKS = [
  { href: "/guides/apartment-noise", label: "Guides" },
  { href: "/noise-laws", label: "Noise Laws" },
  { href: "/community", label: "Tenant Rights & Tools" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-outline-variant/20">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold tracking-tighter text-primary"
        >
          NoisyApartment
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                isActive(link.href)
                  ? "font-body-md text-body-md text-primary border-b-2 border-secondary font-bold pb-1"
                  : "font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <HeaderSearch />
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-primary"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant/20 bg-background px-margin-mobile py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={
                isActive(link.href)
                  ? "font-body-md text-body-md text-primary font-bold"
                  : "font-body-md text-body-md text-on-surface-variant"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
