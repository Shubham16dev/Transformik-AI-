import { supabaseServer } from "@/utils/supabaseServer";
import { ToolCard } from "@/components/tools/ToolCard";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";

interface RelatedToolsProps {
  currentToolId: number;
  categories: string[];
}

export async function RelatedTools({
  currentToolId,
  categories,
}: RelatedToolsProps) {
  // Fetch related tools based on category overlap
  const { data: relatedTools, error } = await supabaseServer
    .from("tools_summary")
    .select("id, tool_name, slug, one_line_description, logo,category")
    .overlaps("category", categories) // ✅ use overlaps()
    .neq("id", currentToolId)
    .limit(4);

  // console.log("Categories:", JSON.stringify(categories));
  // console.log(`Related tools found: ${relatedTools?.length || 0}`);

  if (error) {
    console.error("Error fetching related tools:", error);
    return null;
  }

  if (!relatedTools || relatedTools.length === 0) {
    return <p className="text-gray-500">No related tools found.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedTools.map((tool) => {
          const logoUrl = getPublicImageUrl(
            "Images",
            tool.logo ? `ToolLogos/${tool.logo}` : undefined
          );

          return (
            <ToolCard
              key={tool.id}
              tool={{
                tool_name: tool.tool_name,
                slug: tool.slug,
                one_line_description: tool.one_line_description,
                category: tool.category,
                logo: logoUrl, // Use the generated logo URL
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
