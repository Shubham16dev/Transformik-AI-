import { supabaseServer } from "@/utils/supabaseServer";
import { FreeToolsContent } from "./FreeToolsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Tools | Discover Best Free AI Tools - Transformik AI",
  description:
    "Explore our collection of completely free AI tools. Find free tools for writing, coding, design, marketing, and more. No credit card required.",
  alternates: {
    canonical: "https://www.transformik.com/free-tools",
  },
  openGraph: {
    title: "Free AI Tools | Discover Best Free AI Tools - Transformik AI",
    description:
      "Explore our collection of completely free AI tools. Find free tools for writing, coding, design, marketing, and more. No credit card required.",
    url: "https://www.transformik.com/free-tools",
  },
};

export const revalidate = 3600; // Revalidate every hour

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description: string;
  pricing_model: "Free" | "Freemium" | "Paid" | "Free Trial";
  url: string;
  logo?: string;
  category?: string | string[];
}

interface CategoryOption {
  value: string;
  label: string;
}

async function getFreeTools(): Promise<{
  tools: Tool[];
  categories: CategoryOption[];
}> {
  try {
    const { data: toolsData, error: toolsError } = await supabaseServer
      .from("tools_summary")
      .select(
        "id,tool_name,slug,one_line_description,pricing_model,url,logo,category"
      )
      .eq("pricing_model", "Free");

    if (toolsError) throw toolsError;

    const categorySet = new Set<string>();
    toolsData?.forEach((tool) => {
      const categories = tool.category;

      if (Array.isArray(categories)) {
        categories.forEach((cat) => {
          if (cat && typeof cat === "string") {
            categorySet.add(cat);
          }
        });
      } else if (typeof categories === "string" && categories) {
        categorySet.add(categories);
      }
    });

    const categoryList: CategoryOption[] = [
      { value: "all", label: "All Categories" },
      ...Array.from(categorySet).map((cat) => ({
        value: cat.toLowerCase().replace(/\s+/g, "-"),
        label: cat,
      })),
    ];

    return {
      tools: toolsData || [],
      categories: categoryList,
    };
  } catch (err) {
    console.error("Error fetching tools or categories:", err);
    return {
      tools: [],
      categories: [{ value: "all", label: "All Categories" }],
    };
  }
}

export default async function FreeToolsPage() {
  const { tools, categories } = await getFreeTools();

  return <FreeToolsContent tools={tools} categories={categories} />;
}
