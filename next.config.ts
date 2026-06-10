import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /** Allows dev overlay/HMR when opening the app via LAN URL (e.g. phone). Wildcard covers the whole local subnet. */
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.*", "192.168.0.*"],

  images: {
    qualities: [75, 90, 92, 94],
    localPatterns: [
      {
        pathname: "/images/products_2560x1440px/**",
      },
      {
        pathname: "/images/**",
      },
    ],
  },

  // Fixes "inferred your workspace root" when a stray lockfile exists in a parent folder.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
