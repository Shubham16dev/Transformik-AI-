"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);

      const { data: toolsData, error } = await supabase
        .from("tools_summary")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
        return;
      }

      const categoryCount: Record<string, number> = {};

      toolsData?.forEach((tool) => {
        const categories = tool.category;

        if (Array.isArray(categories)) {
          // Handle array of categories
          categories.forEach((cat) => {
            if (cat && typeof cat === "string") {
              categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            }
          });
        } else if (typeof categories === "string" && categories) {
          // Handle single category string
          categoryCount[categories] = (categoryCount[categories] || 0) + 1;
        } else {
          // Handle uncategorized
          categoryCount["Uncategorized"] =
            (categoryCount["Uncategorized"] || 0) + 1;
        }
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

  // Memoize sorted categories
  const sortedCategories = useMemo(() => {
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortMode === "alpha-asc") return a.name.localeCompare(b.name);
      if (sortMode === "alpha-desc") return b.name.localeCompare(a.name);
      if (sortMode === "count-asc") return a.count - b.count;
      if (sortMode === "count-desc") return b.count - a.count;
      return 0;
    });
  }, [categories, sortMode, search]);

  const currentOption = sortOptions.find((o) => o.value === sortMode);

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
        <input
          type="text"
          aria-label="Search categories"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
        />

        {!isLoading && categories.length > 0 && (
          <Select value={sortMode} onValueChange={setSortMode}>
            <SelectTrigger className="w-[220px] rounded-md border-gray-300 bg-white shadow-sm hover:border-purple-500 transition-all">
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
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={`py-2 ${
                    sortMode === option.value
                      ? "bg-purple-50 text-purple-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="animate-pulse h-20 rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : sortedCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((category) => (
            <Card
              key={category.slug}
              className="hover:shadow-md transition-shadow border border-gray-200 p-4 rounded-xl cursor-pointer"
              onClick={() =>
                router.push(
                  `/tools/category/${category.slug}`
                )
              }
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
      ) : (
        <div className="text-center py-8">
          <p>No categories found matching your search.</p>
        </div>
      )}
    </div>
  );
}
