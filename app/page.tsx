import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { BlogCard } from "@/components/blog/BlogCard";

export default async function HomePage() {
  // Fetch Featured Tool (latest added)
  const { data: featuredTools } = await supabase
    .from("tools")
    .select("id, name, slug, one_line_description, price, url")
    .order("name", { ascending: true }) // <-- use name
    .limit(1);

  // Fetch Latest Tools (next 6 tools)
  const { data: latestTools } = await supabase
    .from("tools")
    .select("id, name, slug, one_line_description, price, url")
    .order("name", { ascending: true }) // <-- use name
    .limit(6);

  // Fetch Latest Blogs (5)
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt")
    .order("created_at", { ascending: false })
    .limit(5);

  console.log({ featuredTools, latestTools, blogs });

  return (
    <div className="space-y-16 px-6 py-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative bg-[#181828] text-white py-20 w-full overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-600/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>

        <div className="relative w-full text-center space-y-8 px-6">
          {/* Top badge */}
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
            AI tools for all your needs
          </div>

          {/* Main heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Discover the Best
            <br />
            <span className="text-white/90">
              AI Tools for Your Business
            </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Find, compare, and choose the perfect AI solutions to transform your workflow.
            </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search AI tools..."
                className="w-full px-6 py-4 rounded-full text-[#181828] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#181828] text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* CTA Button */}
          {/* <div className="pt-4">
            <button className="bg-white text-[#181828] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Join For Free
            </button>
          </div> */}
        </div>
      </section>

      {/* Featured + Latest Tools Section */}
      <section className="grid grid-cols-1 md:grid-cols-10 gap-6">
        {/* Featured Tool 30% */}
        <div className="md:col-span-3">
          <div className="space-y-4">
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
        </div>

        {/* Latest Tools 70% */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}
