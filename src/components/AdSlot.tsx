import { AD_NETWORK_ENABLED } from "@/lib/ads-config";

function formatSlotLabel(slot: string): string {
  return slot
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Reserved, clearly-labeled ad placeholder. Renders nothing but the label
 * until AD_NETWORK_ENABLED is flipped on and a real network snippet is wired
 * in — see src/lib/ads-config.ts.
 */
export default function AdSlot({ slot }: { slot: string }) {
  if (AD_NETWORK_ENABLED) {
    // TODO: render the real ad network unit for this slot here.
    return null;
  }

  return (
    <div
      data-ad-slot={slot}
      className="my-10 flex items-center justify-center border border-dashed border-outline-variant bg-surface-container-low py-10 text-center"
    >
      <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        Ad Placeholder — {formatSlotLabel(slot)}
      </span>
    </div>
  );
}
