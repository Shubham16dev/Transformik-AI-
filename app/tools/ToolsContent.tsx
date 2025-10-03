"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { Pagination } from "@/components/Pagination";
import { FilterCombobox } from "@/components/ui/FilterCombobox";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";

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

const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "Free", label: "Free" },
  { value: "Freemium", label: "Freemium" },
  { value: "Free Trial", label: "Free Trial" },
  { value: "Premium", label: "Premium" },
];

export function ToolsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryParam || "all");
  const [priceFilter, setPriceFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Fetch tools and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tools_summary")
          .select("*")
          .order("tool_name", { ascending: true });

        if (error) throw error;
        setTools(data ?? []);

        // Extract unique categories from all tools
        const allCategories: string[] = [];
        data?.forEach((tool) => {
          const toolCategories = tool.category;

          if (Array.isArray(toolCategories)) {
            // Handle array of categories
            toolCategories.forEach((cat) => {
              if (cat && typeof cat === "string") {
                allCategories.push(cat);
              }
            });
          } else if (typeof toolCategories === "string" && toolCategories) {
            // Handle single category string
            allCategories.push(toolCategories);
          }
        });

        // Get unique categories and sort them
        const uniqueCategories = Array.from(new Set(allCategories)).sort();
        setCategories(uniqueCategories);

        // Apply category param from URL
        if (categoryParam) {
          // Try to match the category param directly with available categories
          const matchingCategory = uniqueCategories.find(
            (cat) =>
              cat.toLowerCase() === categoryParam.toLowerCase() ||
              cat.toLowerCase() ===
                categoryParam.replace(/-/g, " ").toLowerCase()
          );

          if (matchingCategory) {
            setCategory(matchingCategory);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam]);

  // Filtering (memoized for performance)
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = tool.tool_name
        .toLowerCase()
        .includes(search.toLowerCase());

      let matchesCategory = category === "all";

      if (!matchesCategory) {
        const toolCategories = tool.category;

        if (Array.isArray(toolCategories)) {
          // Check if any category in the array matches
          matchesCategory = toolCategories.some(
            (cat) =>
              cat &&
              typeof cat === "string" &&
              cat.toLowerCase() === category.toLowerCase()
          );
        } else if (typeof toolCategories === "string" && toolCategories) {
          // Check single category string
          matchesCategory =
            toolCategories.toLowerCase() === category.toLowerCase();
        }
      }

      const matchesPrice =
        priceFilter === "all" ||
        tool.pricing_model?.toLowerCase() === priceFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [tools, search, category, priceFilter]);

  // Pagination slice
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTools.slice(start, start + pageSize);
  }, [filteredTools, currentPage]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All AI Tools</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          aria-label="Search tools"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2"
        />

        <FilterCombobox
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
          placeholder="Select Category"
        />

        <FilterCombobox
          value={priceFilter}
          onChange={setPriceFilter}
          options={PRICE_OPTIONS}
          placeholder="Select Price"
        />
      </div>

      {/* Tools Grid */}
      {loading ? (
        <p className="text-gray-500">Loading tools...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedTools.length ? (
            paginatedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={{
                  tool_name: tool.tool_name,
                  slug: tool.slug,
                  one_line_description: tool.one_line_description,
                  pricing_model: [
                    "Free",
                    "Freemium",
                    "Free Trial",
                    "Paid",
                  ].includes(tool.pricing_model)
                    ? (tool.pricing_model as
                        | "Free"
                        | "Freemium"
                        | "Free Trial"
                        | "Paid")
                    : undefined,
                  url: tool.url,
                  category: Array.isArray(tool.category)
                    ? tool.category[0] || "Other"
                    : tool.category || "Other",
                  logo: getPublicImageUrl(
                    "Images",
                    tool.logo ? `ToolLogos/${tool.logo}` : undefined
                  ),
                }}
              />
            ))
          ) : (
            <p className="text-gray-500">
              No tools found matching your filters.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        totalItems={filteredTools.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
