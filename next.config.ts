import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false
  },
  compiler: {
    cssMinifier: 'parcel'
  }
};

export default nextConfig;
