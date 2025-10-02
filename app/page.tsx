import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { BlogCard, BlogCategory } from "@/components/blog/BlogCard";
import { SearchBar } from "@/components/layout/SearchBar";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import Link from "next/link";
import { FeaturedTools } from "@/components/tools/FeaturedTool";

// ---------- Types ----------
type PricingModel = "Free" | "Freemium" | "Paid" | "Free Trial";

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description: string;
  pricing_model?: PricingModel;
  url: string;
  logo?: string;
  category?: string; // use enum string here
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  author?: string;
  category?: BlogCategory; // enum type
}

// ---------- Data Fetchers ----------
async function getFeaturedTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools_summary")
    .select("id, tool_name, slug, one_line_description, pricing_model, url, logo, category")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching featured tools:", error.message);
    return [];
  }

  return (
    data?.map((tool) => ({
      ...tool,
      logo: getPublicImageUrl("Logo_Images", tool.logo),
    })) ?? []
  );
}

async function getLatestTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools_summary")
    .select("id, tool_name, slug, one_line_description, pricing_model, url, logo, category")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching latest tools:", error.message);
    return [];
  }

  return (
    data?.map((tool) => ({
      ...tool,
      logo: getPublicImageUrl("Logo_Images", tool.logo),
    })) ?? []
  );
}

async function getBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from("blogs_summary")
    .select("id, title, slug, excerpt, category")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching blogs:", error.message);
    return [];
  }

  return data ?? [];
}

// ---------- Page ----------
export default async function HomePage() {
  const [featuredTools, latestTools, blogs] = await Promise.all([
    getFeaturedTools(),
    getLatestTools(),
    getBlogs(),
  ]);

  return (
    <main className="space-y-16">
      {/* Search Bar */}
      <SearchBar />

      <div className="px-6 py-8 max-w-7xl mx-auto space-y-16">
        {/* Featured + Latest Tools */}
        <section aria-labelledby="tools-section" className="grid grid-cols-1 md:grid-cols-10 gap-6">
          <div className="md:col-span-3 space-y-4">
            <FeaturedTools limit={3} />
          </div>

          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold">Latest Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {latestTools.length > 0 ? (
                latestTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
              ) : (
                <p className="text-gray-500">No latest tools available.</p>
              )}
            </div>
          </div>
        </section>

        {/* Blogs Section */}
        <section aria-labelledby="blogs-section" className="space-y-4">
          <div className="text-center space-y-2">
            <h2 id="blogs-section" className="text-2xl font-bold">Explore AI Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest insights, tutorials, and trends in AI tools and technology.
            </p>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
              <div className="md:col-span-6 space-y-4">
                <h3 className="text-xl font-semibold">Latest in AI</h3>
                {blogs.slice(0, 2).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
                <div className="pt-4">
                  <Link
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    View All Blogs →
                  </Link>
                </div>
              </div>
              <div className="md:col-span-4 space-y-4">
                <h3 className="text-xl font-semibold">More Stories</h3>
                {blogs.slice(2).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No blogs available.</p>
          )}
        </section>
      </div>
    </main>
  );
}