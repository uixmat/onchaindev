import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { hostname: "i.seadn.io" },
      { hostname: "i2c.seadn.io" },
      { hostname: "raw2.seadn.io" },
      { hostname: "openseauserdata.com" },
      { hostname: "*.openseauserdata.com" },
    ],
  },
};

export default nextConfig;
