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

  // Production optimizations
  poweredByHeader: false,

  // Output standalone for smaller Docker images (optional)
  // output: 'standalone',
};

export default nextConfig;
