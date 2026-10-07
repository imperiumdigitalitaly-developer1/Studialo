import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le pagine degli appunti sono generate tutte al momento del build.
  trailingSlash: false,
};

export default nextConfig;
