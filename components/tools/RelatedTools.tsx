import { supabaseServer } from "@/utils/supabaseServer";
import { ToolCard } from "@/components/tools/ToolCard";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";

interface RelatedToolsProps {
  currentToolId: number;
  categories: string[];
}

interface RelatedTool {
  id: number;
  tool_name: string;
  slug: string;
  one_line_description: string;
  logo?: string | null;
  category?: string | string[] | null;
  pricing_model?: string;
  url?: string;
}

export async function RelatedTools({
  currentToolId,
  categories,
}: RelatedToolsProps) {
  let relatedTools: RelatedTool[] = [];

  // Strategy 1: Try to get tools that share at least one category
  if (categories && categories.length > 0) {
    // Use contains for each category and combine results
    const promises = categories.slice(0, 3).map(async (category) => {
      const { data, error } = await supabaseServer
        .from("tools_summary")
        .select(
          "id, tool_name, slug, one_line_description, logo, category, pricing_model, url"
        )
        .contains("category", [category])
        .neq("id", currentToolId)
        .order("tool_name", { ascending: true })
        .limit(4);

      if (error) {
        console.error(
          "Related tools fetch error for category:",
          category,
          error
        );
        return [];
      }
      return data || [];
    });

    const results = await Promise.all(promises);
    const allTools = results.flat();

    // Deduplicate by id
    const uniqueToolsMap = new Map();
    allTools.forEach((tool) => {
      if (!uniqueToolsMap.has(tool.id)) {
        uniqueToolsMap.set(tool.id, tool);
      }
    });

    relatedTools = Array.from(uniqueToolsMap.values());
  }

  // Strategy 2: If no related tools found, get random popular tools
  if (relatedTools.length === 0) {
    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select(
        "id, tool_name, slug, one_line_description, logo, category, pricing_model, url"
      )
      .neq("id", currentToolId)
      .limit(6);

    console.log("Fallback related tools fetch error:", error);

    if (!error && data) {
      relatedTools = data;
    }
  }

  // Limit to 4 tools for display
  const displayTools = relatedTools.slice(0, 4);

  if (displayTools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayTools.map((tool) => {
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
                category: tool.category ?? undefined,
                pricing_model: tool.pricing_model as
                  | "Free"
                  | "Freemium"
                  | "Paid"
                  | "Free Trial"
                  | undefined,
                url: tool.url,
                logo: logoUrl,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
