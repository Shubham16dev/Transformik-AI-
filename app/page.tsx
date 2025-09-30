import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { SearchBar } from "@/components/layout/SearchBar";

export default async function HomePage() {
  // Fetch Featured Tool (latest added)
  const { data: featuredTools } = await supabase
    .from("tools")
    .select("id, name, slug, one_line_description, price, url")
    .order("name", { ascending: true })
    .limit(1);

  // Fetch Latest Tools (next 6 tools)
  const { data: latestTools } = await supabase
    .from("tools")
    .select("id, name, slug, one_line_description, price, url")
    .order("name", { ascending: true })
    .limit(6);

  // Fetch Latest Blogs (5)
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-16">
      {/* HeroSection goes here if you have it */}
      <SearchBar />

      {/* ✅ Main content container */}
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-16">
        {/* Featured + Latest Tools Section */}
        <section className="grid grid-cols-1 md:grid-cols-10 gap-6">
          {/* Featured Tool 30% */}
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-2xl font-bold">Featured Tool</h2>
            {featuredTools?.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={{
                  name: tool.name,
                  slug: tool.slug,
                  description: tool.one_line_description,
                  price: tool.price,
                  url: tool.url,
                }}
              />
            ))}
          </div>

          {/* Latest Tools 70% */}
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold">Latest Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {latestTools?.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={{
                    name: tool.name,
                    slug: tool.slug,
                    description: tool.one_line_description,
                    price: tool.price,
                    url: tool.url,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Blogs Section */}
        <section className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Explore AI Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest insights, tutorials, and trends in AI
              tools and technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            {/* Latest 2 Blogs - Left Side (Bigger) */}
            <div className="md:col-span-6 space-y-4">
              <h3 className="text-xl font-semibold">Latest in AI</h3>
              {blogs?.slice(0, 2).map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={{
                    title: blog.title,
                    slug: blog.slug,
                    excerpt: blog.excerpt,
                  }}
                />
              ))}
                <div className="pt-4">
                  <a
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    View All Blogs →
                  </a>
                </div>
            </div>
            

            {/* Rest of the Blogs - Right Side */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-xl font-semibold">More Stories</h3>
              {blogs?.slice(2).map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={{
                    title: blog.title,
                    slug: blog.slug,
                    excerpt: blog.excerpt,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
