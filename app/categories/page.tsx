"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Category {
  name: string;
  count: number;
  slug: string;
}

// Color mapping for categories (similar to what's in ToolCard.tsx)
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    "AI Writing": "bg-blue-100 text-blue-800 border-blue-500",
    "Image Generation": "bg-purple-100 text-purple-800 border-purple-500",
    "Video Creation": "bg-red-100 text-red-800 border-red-500",
    "Audio Tools": "bg-green-100 text-green-800 border-green-500",
    Productivity: "bg-yellow-100 text-yellow-800 border-yellow-500",
    Marketing: "bg-pink-100 text-pink-800 border-pink-500",
    "Developer Tools": "bg-blue-100 text-blue-800 border-blue-500",
    "Image editing": "bg-purple-100 text-purple-800 border-purple-500",
    "Assistant Code": "bg-indigo-100 text-indigo-800 border-indigo-500",
    Automation: "bg-teal-100 text-teal-800 border-teal-500",
    // Add more categories as needed
  };

  return colors[category] || "bg-gray-100 text-gray-800 border-gray-500";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);

      // Fetch tools to extract categories
      const { data: toolsData, error } = await supabase
        .from("tools")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
        return;
      }

      // Process categories and count tools in each category
      const categoryCount: Record<string, number> = {};

      toolsData.forEach((tool) => {
        const category = tool.category || "Uncategorized";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      // Convert to array of category objects
      const categoryArray: Category[] = Object.entries(categoryCount).map(
        ([name, count]) => ({
          name,
          count,
          // Create a slug for potential future category pages
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        })
      );

      // Sort by tool count (descending)
      categoryArray.sort((a, b) => b.count - a.count);

      setCategories(categoryArray);
      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">AI Categories</h1>
        <p className="text-gray-600">
          Explore our comprehensive list of AI tools by category.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            return (
              <Link
                key={category.slug}
                href={`/tools?category=${category.slug}`}
                className="block"
              >
                <Card className="hover:shadow-sm transition-shadow border border-gray-200 p-4">
                  <div className="flex justify-between items-center">
                    {/* Left side: Category name */}
                    <div>
                      <h3 className="text-base font-medium text-gray-800">
                        {category.name}
                      </h3>
                    </div>

                    {/* Right side: Count in purple */}
                    <div>
                      <span className="text-purple-600 text-base font-medium">
                        {category.count}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <div className="text-center py-8">
          <p>No categories found. Please add tools with categories first.</p>
        </div>
      )}
    </div>
  );
}
