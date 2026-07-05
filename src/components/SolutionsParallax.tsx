"use client";

import { useEffect } from "react";

export default function SolutionsParallax() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const shadows = document.querySelectorAll<HTMLElement>(".hard-shadow");
      const x = (window.innerWidth / 2 - e.pageX) / 100;
      const y = (window.innerHeight / 2 - e.pageY) / 100;

      shadows.forEach((s) => {
        s.style.boxShadow = `${4 + x}px ${4 + y}px 0px 0px rgba(81, 54, 45, 0.2)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
}
