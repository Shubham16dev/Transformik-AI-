"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

interface CategoriesContentProps {
  categories: Category[];
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

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const [sortMode, setSortMode] = useState<string>("alpha-asc");
  const [search, setSearch] = useState<string>("");

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
    <>
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

        {categories.length > 0 && (
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
      {sortedCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/tools/category/${category.slug}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow border border-gray-200 p-4 rounded-xl cursor-pointer h-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-gray-800">
                    {category.name}
                  </h3>
                  <span className="text-purple-600 text-base font-semibold">
                    {category.count}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No categories found matching your search.</p>
        </div>
      )}
    </>
  );
}
