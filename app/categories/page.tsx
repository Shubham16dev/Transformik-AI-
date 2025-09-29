"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CategoriesHero } from "@/components/layout/CategoriesHero";
import { ArrowDown01, ArrowUp10, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

interface Category {
  name: string;
  count: number;
  slug: string;
}

// Sort options with icons
const sortOptions = [
  {
    value: "count-desc",
    label: "Most Tools → Least Tools",
    icon: <ArrowDown01 className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "count-asc",
    label: "Least Tools → Most Tools",
    icon: <ArrowUp10 className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "alpha-asc",
    label: "Alphabetical (A → Z)",
    icon: <ArrowDownAZ className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "alpha-desc",
    label: "Alphabetical (Z → A)",
    icon: <ArrowUpAZ className="h-4 w-4 text-purple-600" />,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<string>("alpha-asc");
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);

      const { data: toolsData, error } = await supabase
        .from("tools")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
        return;
      }

      const categoryCount: Record<string, number> = {};

      toolsData.forEach((tool) => {
        const category = tool.category || "Uncategorized";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const categoryArray: Category[] = Object.entries(categoryCount).map(
        ([name, count]) => ({
          name,
          count,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        })
      );

      setCategories(categoryArray);
      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  // Sorting logic
  const sortedCategories = [...categories].sort((a, b) => {
    if (sortMode === "alpha-asc") return a.name.localeCompare(b.name);
    if (sortMode === "alpha-desc") return b.name.localeCompare(a.name);
    if (sortMode === "count-asc") return a.count - b.count;
    if (sortMode === "count-desc") return b.count - a.count;
    return 0;
  });

  // Current selected option
  const currentOption = sortOptions.find((o) => o.value === sortMode);

  return (
    <>
      <CategoriesHero />
      <div className="space-y-8 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sort dropdown */}
        {!isLoading && categories.length > 0 && (
          <div className="flex justify-end mb-4">
            <div className="relative inline-block">
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
                className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCategories.map((category) => {
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
    </>
  );
}
