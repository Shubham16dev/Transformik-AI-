"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { ToolCard } from "@/components/tools/ToolCard";
import { FilterCombobox } from "@/components/ui/FilterCombobox";
import { Pagination } from "@/components/Pagination";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

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

const ITEMS_PER_PAGE = 9;
const sortOptions = [
  {
    value: "alpha-asc",
    label: "A → Z",
    icon: <ArrowDownAZ className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "alpha-desc",
    label: "Z → A",
    icon: <ArrowUpAZ className="h-4 w-4 text-purple-600" />,
  },
];

export default function FreeToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortMode, setSortMode] = useState<string>("alpha-asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data: toolsData, error: toolsError } = await supabase
          .from("tools_summary")
          .select(
            "id,tool_name,slug,one_line_description,pricing_model,url,logo,category"
          )
          .eq("pricing_model", "Free");

        if (toolsError) throw toolsError;

        setTools(toolsData || []);
        setFilteredTools(toolsData || []);

        const categorySet = new Set<string>();
        toolsData?.forEach((tool) => {
          const categories = tool.category;

          if (Array.isArray(categories)) {
            // Handle array of categories
            categories.forEach((cat) => {
              if (cat && typeof cat === "string") {
                categorySet.add(cat);
              }
            });
          } else if (typeof categories === "string" && categories) {
            // Handle single category string
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
        setCategories(categoryList);
      } catch (err) {
        console.error("Error fetching tools or categories:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter, search & sort
  useEffect(() => {
    let temp = [...tools];

    if (selectedCategory && selectedCategory !== "all") {
      temp = temp.filter((tool) => {
        const categories = tool.category;

        if (Array.isArray(categories)) {
          // Check if any category in the array matches
          return categories.some(
            (cat) =>
              cat &&
              typeof cat === "string" &&
              cat.toLowerCase().replace(/\s+/g, "-") === selectedCategory
          );
        } else if (typeof categories === "string" && categories) {
          // Check single category string
          return (
            categories.toLowerCase().replace(/\s+/g, "-") === selectedCategory
          );
        }

        return false;
      });
    }

    if (search) {
      temp = temp.filter((tool) =>
        tool.tool_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortMode === "alpha-asc")
      temp.sort((a, b) => a.tool_name.localeCompare(b.tool_name));
    if (sortMode === "alpha-desc")
      temp.sort((a, b) => b.tool_name.localeCompare(a.tool_name));

    setFilteredTools(temp);
    setCurrentPage(1);
  }, [search, selectedCategory, sortMode, tools]);

  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Free AI Tools</h1>
        <p className="text-gray-600">
          Explore all AI tools available for free to boost your workflow.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          aria-label="Search free tools"
          placeholder="Search free tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
        />

        <FilterCombobox
          options={categories}
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={setSelectedCategory}
        />

        <FilterCombobox
          options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
          placeholder="Sort tools"
          value={sortMode}
          onChange={setSortMode}
        />
      </div>

      {/* Tools Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading free tools...</p>
        </div>
      ) : paginatedTools.length === 0 ? (
        <p className="text-gray-500">No free tools found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedTools.map((tool) => {
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
      )}

      {/* Pagination */}
      <Pagination
        totalItems={filteredTools.length}
        pageSize={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
