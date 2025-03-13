import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "rc-util/es/hooks/useEvent": require.resolve("rc-util/es/hooks/useEvent"),
    };
    return config;
  },
};

export default nextConfig;
