"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";

// Define a type for the tool objects
interface Tool {
  id: string;
  name: string;
  slug: string;
  one_line_description: string;
  price: string;
  url: string;
  category: string | null;
}

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const [tools, setTools] = useState<Tool[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchToolsByCategory() {
      setIsLoading(true);

      // Convert slug to category name (replace hyphens with spaces and capitalize)
      const formattedCategoryName = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      setCategoryName(formattedCategoryName);

      // Fetch tools by category
      const { data, error } = await supabase
        .from("tools")
        .select("id,name,slug,one_line_description,price,url,category")
        .ilike("category", formattedCategoryName)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching tools by category:", error);
      } else {
        setTools(data || []);
      }

      setIsLoading(false);
    }

    if (slug) {
      fetchToolsByCategory();
    }
  }, [slug]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{categoryName} AI Tools</h1>
        <p className="text-gray-600">
          Explore our collection of {tools.length} AI tools in the{" "}
          {categoryName} category.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading tools...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={{
                  name: tool.name,
                  slug: tool.slug,
                  description: tool.one_line_description,
                  price: tool.price,
                  url: tool.url,
                  category: tool.category || "Uncategorized",
                }}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p>No tools found in this category.</p>
            </div>
          )}
        </div>
      )}

      <div className="pt-4">
        <a href="/categories" className="text-blue-600 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all categories
        </a>
      </div>
    </div>
  );
}
