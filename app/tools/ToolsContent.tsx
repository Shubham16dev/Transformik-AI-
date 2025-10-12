// components/tools/ToolsContent.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { Pagination } from "@/components/Pagination";
import { FilterCombobox } from "@/components/ui/FilterCombobox";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { ToolsSchema } from "@/components/schema/ToolsSchema";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

interface CategoryMeta {
  name?: string;
  meta_title?: string;
  description?: string;
  faqs?: { question: string; answer: string }[] | null;
}

export function ToolsContent({
  categorySlug,
  categoryMeta,
}: {
  categorySlug?: string;
  categoryMeta?: CategoryMeta | null;
}) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

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

        const allCategories: string[] = [];
        data?.forEach((tool) => {
          const toolCategories = tool.category;
          if (Array.isArray(toolCategories)) {
            toolCategories.forEach((cat) => cat && allCategories.push(cat));
          } else if (typeof toolCategories === "string" && toolCategories) {
            allCategories.push(toolCategories);
          }
        });

        const uniqueCategories = Array.from(new Set(allCategories)).sort();
        setCategories(uniqueCategories);

        if (categorySlug) {
          const slugify = (name: string) =>
            name.toLowerCase().trim().replace(/\s+/g, "-");

          const matchingCategory = uniqueCategories.find(
            (cat) => slugify(cat) === categorySlug.toLowerCase()
          );

          setCategory(matchingCategory || "all");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

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
    <>
      {/* Schema Markup */}
      <ToolsSchema
        tools={paginatedTools}
        categoryMeta={categoryMeta}
        categorySlug={categorySlug}
        currentPage={currentPage}
        totalTools={filteredTools.length}
      />

      {/* Hero Section - Full Width */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 w-screen -ml-[50vw] left-1/2 relative">
        <div className="max-w-7xl mx-auto text-left space-y-6 px-6">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold">
            {categoryMeta?.name || categoryMeta?.name || "All AI Tools"}
          </h1>

          <p className="text-base md:text-lg text-gray-300 w-full leading-relaxed">
            {categoryMeta?.description || "Explore our collection of AI tools."}
          </p>
        </div>
      </section>

      <div className="space-y-6 mt-8">
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
                    category: tool.category || "Other",
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

        {/* Optional FAQs section */}
        {categoryMeta?.faqs && categoryMeta.faqs.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-3">
              {categoryMeta.faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="py-2">
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
      </div>
    </>
  );
}
