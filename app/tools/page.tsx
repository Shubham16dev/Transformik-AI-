import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";

export default async function AllToolsPage() {
  const { data: tools, error } = await supabase
    .from("tools")
    .select(`
      id,
      name,
      slug,
      one_line_description,
      price,
      url,
      logo
    `)
    .order("name", { ascending: true });

  if (error) return <p>Error loading tools: {error.message}</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">All AI Tools</h1>

      {/* Search placeholder */}
      <input
        type="text"
        placeholder="Search tools..."
        className="w-full border rounded px-3 py-2"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools?.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={{
              name: tool.name,
              slug: tool.slug,
              description: tool.one_line_description,
              price: tool.price,
              url: tool.url,
              logo: tool.logo, // ✅ pass logo
            }}
          />
        ))}
      </div>
    </div>
  );
}
