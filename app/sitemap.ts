import { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL of your website
  const baseUrl = "https://transformik.com/";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/free-tools`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  // Fetch dynamic blog pages
  const { data: blogs } = await supabase
    .from("blogs_summary")
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  const blogPages =
    blogs?.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || [];

  // Fetch dynamic tool pages (if you have tools in database)
  // You can uncomment and modify this if you have tools stored in Supabase
  /*
  const { data: tools } = await supabase
    .from('tools') // Replace with your actual tools table name
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })

  const toolPages = tools?.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []
  */

  // Combine all pages
  return [
    ...staticPages,
    ...blogPages,
    // ...toolPages, // Uncomment when you have tools
  ];
}
