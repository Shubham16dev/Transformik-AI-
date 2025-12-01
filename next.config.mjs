/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qfvgfrezpemporwxhmny.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache for 7 days
  },

  // Enable compression
  compress: true,

  // Optimize production builds
  swcMinify: true,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@/components", "@/utils", "lucide-react"],
  },

  // Remove the invalid Vercel-injected header from robots.txt
  async headers() {
    return [
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Signal",
            value: "",
          },
          {
            key: "Content-Security-Policy",
            value: "",
          },
        ],
      },
    ];
  },

  // Production optimizations
  poweredByHeader: false,
};

export default nextConfig;
