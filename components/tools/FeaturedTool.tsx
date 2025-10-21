"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";

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

// Simple shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function FeaturedTools({ limit = 5, initialTools }: FeaturedToolsProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools ?? []);
  const [loading, setLoading] = useState(initialTools ? false : true);

  useEffect(() => {
    if (initialTools) return;
    const fetchFeaturedTools = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tools_summary")
          .select(
            "id, tool_name, slug, logo, one_line_description, pricing_model, url, category"
          )
          .limit(30);
        if (error) throw error;
        const shuffled = shuffleArray(data ?? []);
        setTools(shuffled.slice(0, limit));
      } catch (err) {
        console.error("Error fetching featured tools:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedTools();
  }, [limit, initialTools]);

  if (loading)
    return <p className="text-gray-500">Loading featured tools...</p>;
  if (!tools.length)
    return <p className="text-gray-500">No featured tools available.</p>;

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
