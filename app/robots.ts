import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://transformik.com/";

  return {
    rules: [
      // Allow all search engines
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "*.pdf"],
      },
      // Block AI crawlers/scrapers if desired (optional)
      // Uncomment the following blocks if you want to block AI training crawlers:
      // {
      //   userAgent: "GPTBot",
      //   disallow: "/",
      // },
      // {
      //   userAgent: "ChatGPT-User",
      //   disallow: "/",
      // },
      // {
      //   userAgent: "CCBot",
      //   disallow: "/",
      // },
      // {
      //   userAgent: "anthropic-ai",
      //   disallow: "/",
      // },
      // {
      //   userAgent: "Claude-Web",
      //   disallow: "/",
      // },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
