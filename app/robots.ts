import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://transformik.com/";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/", "*.pdf"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
