"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = { title: document.title, url: window.location.href };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the native share sheet — nothing to do.
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-10 h-10 border border-outline flex items-center justify-center hover:bg-secondary-container transition-colors"
      aria-label={copied ? "Link copied" : "Share this page"}
    >
      {copied ? (
        <Check size={18} className="text-tertiary" />
      ) : (
        <Share2 size={18} className="text-tertiary" />
      )}
    </button>
  );
}
