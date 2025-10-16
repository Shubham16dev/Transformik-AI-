// app/tools/page.tsx
import { supabaseServer } from "@/utils/supabaseServer";
import { ToolsContent } from "./ToolsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All AI Tools | Browse 10,000+ AI Tools - Transformik AI",
  description:
    "Browse and discover all AI tools in our comprehensive directory. Find AI tools for writing, coding, marketing, design, and more. Updated daily.",
  alternates: {
    canonical: "https://www.transformik.com/tools",
  },
  openGraph: {
    title: "All AI Tools | Browse 10,000+ AI Tools - Transformik AI",
    description:
      "Browse and discover all AI tools in our comprehensive directory. Find AI tools for writing, coding, marketing, design, and more. Updated daily.",
    url: "https://www.transformik.com/tools",
  },
};

export const revalidate = 3600; // Revalidate every hour

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description: string;
  pricing_model: string;
  url?: string;
  category?: string | string[] | null;
  logo?: string | null;
}

async function getTools(): Promise<Tool[]> {
  try {
    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select("*")
      .order("tool_name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching tools:", err);
    return [];
  }
}

export default async function ToolsPage() {
  const tools = await getTools();

  // Extract unique categories
  const allCategories: string[] = [];
  tools.forEach((tool) => {
    const toolCategories = tool.category;
    if (Array.isArray(toolCategories)) {
      toolCategories.forEach((cat) => cat && allCategories.push(cat));
    } else if (typeof toolCategories === "string" && toolCategories) {
      allCategories.push(toolCategories);
    }
  });
  const categories = Array.from(new Set(allCategories)).sort();

  return <ToolsContent tools={tools} categories={categories} />;
}
