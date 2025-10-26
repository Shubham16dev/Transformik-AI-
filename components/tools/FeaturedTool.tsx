import { ToolCard } from "@/components/tools/ToolCard";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { supabaseServer } from "@/utils/supabaseServer";

interface FeaturedToolsProps {
  limit?: number;
  initialTools?: Tool[];
}

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description: string;
  pricing_model: string;
  url?: string;
  logo?: string | null;
  category?: string | null;
}

export async function FeaturedTools({ limit = 5 }: FeaturedToolsProps) {
  const { data: tools, error } = await supabaseServer
    .from("tools_summary")
    .select(
      "id, tool_name, slug, one_line_description, pricing_model, url, logo, category"
    )
    .order("tool_name", { ascending: true })
    .limit(limit);

  if (error || !tools?.length) {
    return <p className="text-gray-500">No featured tools available.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Featured Tools
      </h3>
      <div className="space-y-4">
        {tools.map((tool) => {
          const logoUrl = tool.logo
            ? getPublicImageUrl("Images", `ToolLogos/${tool.logo}`)
            : undefined;

          return (
            <ToolCard
              key={tool.id}
              tool={{
                tool_name: tool.tool_name,
                slug: tool.slug,
                one_line_description: tool.one_line_description,
                pricing_model: [
                  "Free",
                  "Freemium",
                  "Paid",
                  "Free Trial",
                ].includes(tool.pricing_model)
                  ? (tool.pricing_model as
                      | "Free"
                      | "Freemium"
                      | "Paid"
                      | "Free Trial")
                  : undefined,
                url: tool.url,
                logo: logoUrl,
                category: tool.category ?? "Other",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
