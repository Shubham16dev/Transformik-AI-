"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp10 } from "lucide-react";

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

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortMode === "alpha-asc") return a.name.localeCompare(b.name);
    if (sortMode === "alpha-desc") return b.name.localeCompare(a.name);
    if (sortMode === "count-asc") return a.count - b.count;
    if (sortMode === "count-desc") return b.count - a.count;
    return 0;
  });

  const currentOption = sortOptions.find((o) => o.value === sortMode);

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top-right sort dropdown */}
      {!isLoading && categories.length > 0 && (
        <div className="flex justify-end mb-4">
          
          <Select value={sortMode} onValueChange={setSortMode}>
            <SelectTrigger className="w-[220px] rounded-xl border-gray-300 bg-white shadow-sm hover:border-purple-500 transition-all">
              {currentOption ? (
                <div className="flex items-center gap-2">
                  {currentOption.icon}
                  <span>{currentOption.label}</span>
                </div>
              ) : (
                <SelectValue placeholder="Sort categories" />
              )}
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto rounded-xl shadow-lg border border-gray-200">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="py-2">
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((category) => (
            <Card
              key={category.slug}
              className="hover:shadow-md transition-shadow border border-gray-200 p-4 rounded-xl cursor-pointer"
              onClick={() => router.push(`/tools?category=${category.slug}`)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium text-gray-800">
                  {category.name}
                </h3>
                <span className="text-purple-600 text-base font-semibold">
                  {category.count}
                </span>
              </div>
            </Card>
          ))}
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
