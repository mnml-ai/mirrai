import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Allows dev overlay/HMR when opening the app via LAN URL (e.g. phone). Router IPs change — edit if yours differs. */
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "192.168.1.192",
    "192.168.1.187",
    "192.168.1.186",
    "192.168.1.182",
    "192.168.1.167",
    "192.168.1.146",
    "192.168.1.112",
  ],

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
    root: import.meta.dirname,
  },
};

export default nextConfig;
