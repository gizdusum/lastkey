/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/etherlink/:path*",
        destination: `${process.env.ETHERLINK_RPC_URL || "https://node.shadownet.etherlink.com"}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
