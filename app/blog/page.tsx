import { supabaseServer } from "@/utils/supabaseServer";
import { BlogListingContent } from "./BlogListingContent";
import { BlogSchema } from "@/components/schema/BlogSchema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Blog | Latest AI Insights and Tutorials - Transformik AI",
  description:
    "Stay updated with the latest AI insights, tutorials, and trends. Explore our comprehensive blog covering AI tools, techniques, and industry developments.",
  alternates: {
    canonical: "https://www.transformik.com/blog",
  },
  openGraph: {
    title: "AI Blog | Latest AI Insights and Tutorials - Transformik AI",
    description:
      "Stay updated with the latest AI insights, tutorials, and trends. Explore our comprehensive blog covering AI tools, techniques, and industry developments.",
    url: "https://www.transformik.com/blog",
  },
};

export const revalidate = 3600; // Revalidate every hour

interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  featured_image?: string;
  author?: string;
  created_at: string;
}

async function getBlogs(): Promise<BlogSummary[]> {
  try {
    const { data, error } = await supabaseServer
      .from("blogs_summary")
      .select("*")
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

export default async function BlogListingPage() {
  const blogs = await getBlogs();

  return (
    <>
      {/* Schema Markup */}
      <BlogSchema
        isListingPage={true}
        blogs={blogs}
        blog={{
          id: "blog-listing",
          title: "AI Blog | Latest AI Insights and Tutorials",
          slug: "blog",
          excerpt:
            "Stay updated with the latest AI insights, tutorials, and trends",
          created_at: "2024-01-01T00:00:00.000Z", // Static date for listing page
        }}
      />

      <BlogListingContent initialBlogs={blogs} />
    </>
  );
}
