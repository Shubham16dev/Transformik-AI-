import { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase";

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

  // Category pages
  const categories = [
    "text-to-video-tools",
    "ai-agents",
    "ai-animation-tools",
    "ai-art-generators",
    "ai-characters",
    "ai-chatbots",
    "ai-chrome-extensions",
    "ai-code-review-tools",
    "ai-coding-assistants",
    "ai-copywriting-tools",
    "ai-customer-service-bots",
    "ai-customer-support",
    "ai-data-analysis-tools",
    "ai-data-visualization-tools",
    "ai-deepfake-and-face-swap-tools",
    "ai-fun-tools",
    "ai-games-tools",
    "ai-headshot-generators",
    "ai-image-generators",
    "ai-interior-design-tools",
    "ai-lead-generation-tools",
    "ai-logo-generators",
    "ai-market-research-tools",
    "ai-meeting-assistants",
    "ai-music-generators",
    "ai-paraphrasing-tools",
    "ai-presentation-makers",
    "ai-product-photography",
    "ai-resume-builders",
    "ai-search-engine-tools",
    "ai-search-engines",
    "ai-seo-tools",
    "ai-social-media-management",
    "ai-story-generators",
    "ai-summarizers",
    "ai-tools-for-architects",
    "ai-tools-for-artists",
    "ai-tools-for-marketers",
    "ai-tools-for-musicians",
    "ai-tools-for-students",
    "ai-transcription-tools",
    "ai-translation-tools",
    "ai-video-editors",
    "ai-video-generators",
    "ai-video-upscaling",
    "ai-voice-changers",
    "ai-voice-cloning",
    "ai-website-builders",
    "ai-workflow-automation",
    "ai-writing-assistants",
    "free-ai-tools",
    "future-ai-tools",
    "most-useful-ai-tools",
    "open-source-ai-tools",
    "text-generators",
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/tools/category/${category}`,
    lastModified: new Date(),
  }));

  // Fetch dynamic blog pages
  const { data: blogs } = await supabase
    .from("blogs_summary")
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  const blogPages =
    blogs?.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.created_at),
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
  })) || []
  */

  // Combine all pages
  return [
    ...staticPages,
    ...categoryPages,
    ...blogPages,
    // ...toolPages, // Uncomment when you have tools
  ];
}
