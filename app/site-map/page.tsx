import { supabaseServer } from "@/utils/supabaseServer";
import { SitemapContent } from "./SitemapContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Map | Find All Pages - Transformik AI",
  description:
    "Browse all pages and content on Transformik AI. Find tools, blog posts, categories, and resources easily.",
  alternates: {
    canonical: "https://www.transformik.com/site-map",
  },
};

export const revalidate = 3600; // Revalidate every hour

interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  created_at: string;
}

interface ToolSummary {
  id: string;
  tool_name: string;
  slug: string;
}

async function getBlogs(): Promise<BlogSummary[]> {
  try {
    const { data, error } = await supabaseServer
      .from("blogs_summary")
      .select("id, title, slug, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return [];
  }
}

async function getTools(): Promise<ToolSummary[]> {
  try {
    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select("id, tool_name, slug")
      .order("tool_name", { ascending: true });

    if (error) {
      console.error("Error fetching tools:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching tools:", err);
    return [];
  }
}

export default async function SitemapPage() {
  const blogs = await getBlogs();
  const tools = await getTools();

  // Log the lengths of blogs and tools
  // console.log("✓ Sitemap: Blogs fetched:", blogs.length);
  // console.log("✓ Sitemap: Tools fetched:", tools.length);

  return <SitemapContent blogs={blogs} tools={tools} />;
}
