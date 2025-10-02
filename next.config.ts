// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
  {
    protocol: "https",
    hostname: "qfvgfrezpemporwxhmny.supabase.co",
    pathname: "/storage/v1/object/public/Logo_Images/**",
  },
  {
    protocol: "https",
    hostname: "qfvgfrezpemporwxhmny.supabase.co",
    pathname: "/storage/v1/object/public/Tool_Screenshots/**",
  },
],

  },
};

module.exports = nextConfig;
