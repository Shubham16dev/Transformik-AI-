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
  const relatedTools: RelatedTool[] = [];

  // Strategy 1: Strategic selection from categories
  // 2 tools from primary (1st) category
  // 1 tool from secondary (2nd) category
  // 1 tool from last category
  if (categories && categories.length > 0) {
    const usedIds = new Set<number>();

    // 1. Get 2 tools from primary (first) category
    const primaryCategory = categories[0];
    const { data: primaryTools, error: primaryError } = await supabaseServer
      .from("tools_summary")
      .select(
        "id, tool_name, slug, one_line_description, logo, category, pricing_model, url"
      )
      .contains("category", [primaryCategory])
      .neq("id", currentToolId)
      .order("tool_name", { ascending: true })
      .limit(2);

    if (!primaryError && primaryTools) {
      relatedTools.push(...primaryTools);
      primaryTools.forEach((tool) => usedIds.add(tool.id));
    }

    // 2. Get 1 tool from secondary (2nd) category if it exists and is different
    if (categories.length > 1 && categories[1] !== primaryCategory) {
      const secondaryCategory = categories[1];
      const { data: secondaryTools, error: secondaryError } =
        await supabaseServer
          .from("tools_summary")
          .select(
            "id, tool_name, slug, one_line_description, logo, category, pricing_model, url"
          )
          .contains("category", [secondaryCategory])
          .neq("id", currentToolId)
          .order("tool_name", { ascending: true })
          .limit(5);

      if (!secondaryError && secondaryTools) {
        // Find first tool not already used
        const uniqueTool = secondaryTools.find((tool) => !usedIds.has(tool.id));
        if (uniqueTool) {
          relatedTools.push(uniqueTool);
          usedIds.add(uniqueTool.id);
        }
      }
    }

    // 3. Get 1 tool from last category if it exists and is different from others
    if (categories.length > 2) {
      const lastCategory = categories[categories.length - 1];
      if (lastCategory !== primaryCategory && lastCategory !== categories[1]) {
        const { data: lastTools, error: lastError } = await supabaseServer
          .from("tools_summary")
          .select(
            "id, tool_name, slug, one_line_description, logo, category, pricing_model, url"
          )
          .contains("category", [lastCategory])
          .neq("id", currentToolId)
          .order("tool_name", { ascending: true })
          .limit(5);

        if (!lastError && lastTools) {
          // Find first tool not already used
          const uniqueTool = lastTools.find((tool) => !usedIds.has(tool.id));
          if (uniqueTool) {
            relatedTools.push(uniqueTool);
            usedIds.add(uniqueTool.id);
          }
        }
      }
    }
  }

  // Strategy 2: If we don't have enough tools, fill with random tools
  if (relatedTools.length < 4) {
    const neededCount = 4 - relatedTools.length;
    const usedIds = relatedTools.map((tool) => tool.id);

    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select(
        "id, tool_name, slug, one_line_description, logo, category, pricing_model, url"
      )
      .neq("id", currentToolId)
      .not("id", "in", `(${usedIds.join(",")})`)
      .limit(neededCount);

    if (!error && data) {
      relatedTools.push(...data);
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
