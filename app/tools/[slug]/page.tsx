import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToolCard } from "@/components/tools/ToolCard";

export default async function ToolDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch single tool
  // add logo in select 
  const { data: toolData, error } = await supabase
    .from("tools")
    .select(
      `
      id,
      name,
      slug,
      one_line_description,
      price,
      url
    `
    )
    .eq("slug", params.slug)
    .single();

  if (error || !toolData) return notFound();

  // Fetch featured tools (limit 5 for sidebar)
  const { data: featuredTools } = await supabase
    .from("tools")
    .select("id, name, slug, logo, one_line_description, price, url")
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
        {/* Main Tool Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {toolData.logo ? (
                <Image
                  src={toolData.logo}
                  alt={`${toolData.name} logo`}
                  fill
                  className="object-contain"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Logo</span>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {toolData.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {toolData.one_line_description}
              </p>
              <p className="mt-2 font-semibold text-gray-700">
                Price: {toolData.price}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button asChild variant="outline">
              <a href={toolData.url} target="_blank" rel="noopener noreferrer">
                Visit Tool
              </a>
            </Button>
          </div>

          {/* Detailed Section */}
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              About {toolData.name}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Here you can expand with more detailed description, features,
              screenshots, pricing breakdown, alternatives, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar - 20% */}
      <div className="md:col-span-3 space-y-8">
        {/* Featured Tools */}
        <div >
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

        {/* Categories */}
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
