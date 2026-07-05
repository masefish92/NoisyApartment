/**
 * Single config point for ad monetization. No network ID is committed here —
 * flip AD_NETWORK_ENABLED to true and read the network's client/publisher ID
 * from an env var (e.g. process.env.NEXT_PUBLIC_AD_CLIENT_ID) once a network
 * (AdSense, Ezoic, Mediavine, etc.) has been chosen and configured.
 *
 * TODO: once enabled, load the network's script tag from RootLayout
 * (src/app/layout.tsx) and update AdSlot.tsx to render real ad units instead
 * of the placeholder box.
 */
export const AD_NETWORK_ENABLED = false;
