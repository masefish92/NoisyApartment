import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      // Canonical host is the apex domain (matches every canonical/OG/sitemap
      // URL in the codebase) — permanent-redirect any www. request there,
      // preserving path and query, so Google stops seeing two hosts serving
      // the same content with canonicals pointing away from the served URL.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.noisyapartment.org" }],
        destination: "https://noisyapartment.org/:path*",
        permanent: true,
      },
      // The legacy boutique shop was removed when the site fully committed to a
      // free-content/affiliate model. Permanent-redirect any old bookmarks or
      // inbound links (including ?q= search variants) to the homepage.
      {
        source: "/shop",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
