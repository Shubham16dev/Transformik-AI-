import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToolCard } from "@/components/tools/ToolCard";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch single blog by slug
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !blogData) return notFound();

  // Fetch featured tools (limit 5)
  const { data: featuredTools } = await supabase
    .from("tools")
    .select("id, name, slug, logo, one_line_description, price, url")
    .order("name", { ascending: true })
    .limit(5);

  // Fetch categories (for sidebar)
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-10 px-4 md:px-8 py-6">
      {/* Main Content - 80% */}
      <div className="md:col-span-7 space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 space-y-6">
          {/* Blog Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {blogData.image && (
              <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <Image
                  src={blogData.image}
                  alt={blogData.title}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{blogData.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mt-2">
                {blogData.created_at && (
                  <span>
                    {new Date(blogData.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                {blogData.author && <span>By {blogData.author}</span>}
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose max-w-none mt-4">
            {blogData.content}
          </div>

          {/* Optional Action */}
          {blogData.url && (
            <div className="flex flex-wrap gap-4 mt-4">
              <Button asChild variant="outline">
                <a href={blogData.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - 20% */}
      <div className="md:col-span-3 space-y-8">
        {/* Featured Tools */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Featured Tools
          </h3>
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
                  // logo: tool.logo,
                }}
              />
            ))}
          </div>
        </div>

        {/* Top AI Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Top AI Categories
          </h3>
          <ul className="space-y-2">
            {categories?.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categories/${cat.id}`}
                  className="text-sm text-blue-600 hover:underline block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
