import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://transformik.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "*.pdf"],
      },
      // Optional: block AI crawlers
      // { userAgent: "GPTBot", disallow: "/" },
      // { userAgent: "ChatGPT-User", disallow: "/" },
      // { userAgent: "CCBot", disallow: "/" },
      // { userAgent: "anthropic-ai", disallow: "/" },
      // { userAgent: "Claude-Web", disallow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
