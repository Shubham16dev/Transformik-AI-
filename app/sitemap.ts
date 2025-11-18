import { MetadataRoute } from "next";
import { SupabaseCache } from "@/utils/supabaseOptimized";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache sitemap for 1 hour

interface SitemapData {
  categories: string[];
  blogs: Array<{ slug: string; created_at: string }>;
  tools: Array<{ slug: string; created_at: string }>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL of your website (no trailing slash)
  const baseUrl = "https://www.transformik.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/free-tools`,
      lastModified: new Date(),
    },
  ];

  // Use cached sitemap data to reduce egress usage
  const sitemapData = (await SupabaseCache.getSitemapData()) as SitemapData;
  const { categories, blogs, tools } = sitemapData;

  console.log(
    `✓ Sitemap using cached data: ${categories.length} categories, ${blogs.length} blogs, ${tools.length} tools`
  );

  const categoryPages = categories.map((category: string) => ({
    url: `${baseUrl}/tools/category/${category}`,
    lastModified: new Date(),
  }));

  const blogPages = blogs.map((blog: { slug: string; created_at: string }) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.created_at),
  }));

  const toolPages = tools.map((tool: { slug: string; created_at: string }) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.created_at),
  }));

  // Combine all pages
  const totalPages =
    staticPages.length +
    categoryPages.length +
    blogPages.length +
    toolPages.length;
  console.log(`✓ Sitemap generated with ${totalPages} total pages:`);
  console.log(`  - Static pages: ${staticPages.length}`);
  console.log(`  - Category pages: ${categoryPages.length}`);
  console.log(`  - Blog pages: ${blogPages.length}`);
  console.log(`  - Tool pages: ${toolPages.length}`);

  return [...staticPages, ...categoryPages, ...blogPages, ...toolPages];
}
