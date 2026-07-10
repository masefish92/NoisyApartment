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
