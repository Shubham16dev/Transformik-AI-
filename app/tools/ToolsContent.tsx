// components/tools/ToolsContent.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToolCard } from "@/components/tools/ToolCard";
import { Pagination } from "@/components/Pagination";
import { FilterCombobox } from "@/components/ui/FilterCombobox";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { ToolsSchema } from "@/components/schema/ToolsSchema";
import { FAQSchema } from "@/components/schema/FAQSchema";
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

interface ToolsContentProps {
  tools: Tool[];
  categories: string[];
  categorySlug?: string;
  categoryMeta?: CategoryMeta | null;
  faqs?: { question: string; answer: string }[];
  showDescription?: boolean;
  initialPage?: number;
}

export function ToolsContent({
  tools,
  categories,
  categorySlug,
  categoryMeta,
  faqs,
  showDescription = false,
  initialPage = 1,
}: ToolsContentProps) {
  const router = useRouter();

  // Compute initial category value once to prevent hydration mismatch
  const initialCategory = useMemo(() => {
    if (!categorySlug) return "all";

    const matchingCategory = categories.find(
      (cat) =>
        cat.toLowerCase().trim().replace(/\s+/g, "-") ===
        categorySlug.toLowerCase()
    );

    return matchingCategory || "all";
  }, [categorySlug, categories]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const pageSize = 15;

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

  // Update URL when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    if (currentPage !== 1) {
      handlePageChange(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, priceFilter]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
      <section className="relative bg-[#181828] text-white py-16 w-screen -ml-[50vw] left-1/2 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-purple-600/20" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />

        <div className="relative w-full mx-auto text-center space-y-6 px-6">
          {/* Top badge */}
          {showDescription && (
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
              Discover AI Tools
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {categoryMeta?.name || "All AI Tools"}
          </h1>

          <p className="text-lg md:text-xl text-white/80 w-full mx-auto leading-relaxed">
            {showDescription
              ? "Welcome to Transformik.ai's comprehensive directory of AI tools. Our curated collection features cutting-edge artificial intelligence solutions across multiple categories, helping you discover the perfect AI tools for your projects. Whether you're looking for free AI tools, premium solutions, or specialized tools for specific use cases, our platform makes it easy to compare, filter, and find the best AI technology for your needs."
              : categoryMeta?.description ||
                "Explore our collection of AI tools."}
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

        {/* Pagination */}
        <Pagination
          totalItems={filteredTools.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        {/* FAQs section */}
        {((faqs && faqs.length > 0) ||
          (categoryMeta?.faqs && categoryMeta.faqs.length > 0)) && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {(faqs || categoryMeta?.faqs || []).map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* FAQ Schema for SEO */}
            {(faqs || categoryMeta?.faqs) && (
              <FAQSchema faqs={faqs || categoryMeta?.faqs || []} />
            )}
          </section>
        )}
      </div>
    </>
  );
}
