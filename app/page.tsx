import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { BlogCard } from "@/components/blog/BlogCard";

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
          <h2 className="text-2xl font-bold">Latest Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
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
        </section>
      </div>
    </div>
  );
}
