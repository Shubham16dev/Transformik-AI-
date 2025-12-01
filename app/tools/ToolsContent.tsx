// components/tools/ToolsContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToolCard } from "@/components/tools/ToolCard";
import { Pagination } from "@/components/Pagination";
import { FilterCombobox } from "@/components/ui/FilterCombobox";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { ToolsSchema } from "@/components/schema/ToolsSchema";
import { FAQSchema } from "@/components/schema/FAQSchema";
import { PaginationSEO } from "@/components/PaginationSEO";
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
  totalPages?: number;
  totalTools?: number;
  initialSearch?: string;
  initialCategory?: string;
  initialPriceFilter?: string;
  similarCategories?: { name: string; count: number; slug: string }[];
}

export function ToolsContent({
  tools,
  categories,
  categorySlug,
  categoryMeta,
  faqs,
  showDescription = false,
  initialPage = 1,
  totalPages: serverTotalPages = 1,
  totalTools: serverTotalTools = 0,
  initialSearch = "",
  initialCategory = "all",
  initialPriceFilter = "all",
  similarCategories = [],
}: ToolsContentProps) {
  const router = useRouter();

  // Use server-provided initial values
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [priceFilter, setPriceFilter] = useState(initialPriceFilter);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 15;

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync URL params with state on mount
  useEffect(() => {
    if (!isMounted) return;

    const params = new URLSearchParams(window.location.search);
    const urlSearch = params.get("search") || "";
    const urlCategory = params.get("category") || categorySlug || "all";
    const urlPrice = params.get("price") || "all";
    const urlPage = parseInt(params.get("page") || "1", 10);

    if (urlSearch !== search) setSearch(urlSearch);
    if (urlCategory !== category) setCategory(urlCategory);
    if (urlPrice !== priceFilter) setPriceFilter(urlPrice);
    if (urlPage !== currentPage) setCurrentPage(urlPage);
  }, [isMounted, search, category, priceFilter, currentPage, categorySlug]); // Only run once on mount

  // Update URL when filters change - this will trigger a server-side refetch
  const updateURL = (newFilters: {
    search?: string;
    category?: string;
    price?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();

    const finalSearch = newFilters.search ?? search;
    const finalCategory = newFilters.category ?? category;
    const finalPrice = newFilters.price ?? priceFilter;
    const finalPage = newFilters.page ?? currentPage;

    if (finalSearch) params.set("search", finalSearch);
    // Don't add category param if we're on a category page (categorySlug is set)
    if (finalCategory && finalCategory !== "all" && !categorySlug)
      params.set("category", finalCategory);
    if (finalPrice && finalPrice !== "all") params.set("price", finalPrice);
    if (finalPage > 1) params.set("page", finalPage.toString());

    const queryString = params.toString();
    // Use category page URL if categorySlug is present, otherwise use /tools
    const baseUrl = categorySlug ? `/tools/category/${categorySlug}` : "/tools";
    const newUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    router.push(newUrl);
  };

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    updateURL({ search: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
    updateURL({ category: value, page: 1 });
  };

  const handlePriceChange = (value: string) => {
    setPriceFilter(value);
    setCurrentPage(1);
    updateURL({ price: value, page: 1 });
  };

  // Update URL when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Use server-provided data directly (no client-side filtering)
  const displayTools = tools;
  const totalPages = serverTotalPages;
  const totalItems = serverTotalTools;

  return (
    <>
      {/* SEO Pagination Links */}
      <PaginationSEO
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={
          categorySlug
            ? `https://www.transformik.com/tools/category/${categorySlug}`
            : "https://www.transformik.com/tools"
        }
      />

      {/* Schema Markup */}
      <ToolsSchema
        tools={displayTools}
        categoryMeta={categoryMeta}
        categorySlug={categorySlug}
        currentPage={currentPage}
        totalTools={totalItems}
      />

      {/* Hero Section - Only on page 1 */}
      {currentPage === 1 && (
        <section className="relative bg-[#181828] text-white py-16 w-screen -ml-[50vw] left-1/2 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-purple-600/20" />
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />

          <div className="relative w-full mx-auto text-center space-y-6 px-6">
            {/* Top badge */}
            {/* <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
              Discover AI Tools
            </div> */}

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {categoryMeta?.name || "All AI Tools"}
            </h1>

            <p className="text-lg md:text-xl text-white/80 w-full mx-auto leading-relaxed">
              {showDescription
                ? "Discover powerful AI tools to enhance productivity and innovation. Browse our comprehensive, curated collection of cutting-edge artificial intelligence solutions designed to streamline workflows, boost creativity, and transform how you work. From automation and data analysis to content generation and decision-making, find the perfect AI tools to revolutionize your business processes and unlock new possibilities."
                : categoryMeta?.description ||
                  "Browse our extensive curated collection of AI tools and solutions. Explore hundreds of carefully selected artificial intelligence platforms, applications, and services that can transform your workflow, enhance productivity, and drive innovation across various industries and use cases."}
            </p>
          </div>
        </section>
      )}

      <div className="space-y-6 mt-8">
        {/* Filters */}
        <div
          className="flex flex-col md:flex-row gap-4 items-center"
          suppressHydrationWarning
        >
          <input
            type="text"
            aria-label="Search tools"
            placeholder="Search tools..."
            defaultValue={search}
            onBlur={(e) => {
              if (e.target.value !== search) {
                handleSearchChange(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchChange(e.currentTarget.value);
              }
            }}
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2"
          />

          {isMounted && (
            <>
              <FilterCombobox
                value={category}
                onChange={handleCategoryChange}
                options={[
                  { value: "all", label: "All Categories" },
                  ...categories.map((c) => ({ value: c, label: c })),
                ]}
                placeholder="Select Category"
              />

              <FilterCombobox
                value={priceFilter}
                onChange={handlePriceChange}
                options={PRICE_OPTIONS}
                placeholder="Select Price"
              />
            </>
          )}
        </div>

        {/* Tools Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          suppressHydrationWarning
        >
          {isMounted && displayTools.length ? (
            displayTools.map((tool, index) => (
              <ToolCard
                key={`${tool.id}-${tool.slug}-${index}`}
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
          ) : isMounted ? (
            <p className="text-gray-500">
              No tools found matching your filters.
            </p>
          ) : (
            // Show loading state during hydration
            <div className="col-span-full text-center">
              <p className="text-gray-500">Loading tools...</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {isMounted && totalPages > 1 && (
          <Pagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {/* Similar Categories Section - Only show on category pages */}
        {categorySlug && similarCategories && similarCategories.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Similar Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {similarCategories.map((category, index) => (
                <a
                  key={`${category.slug}-${index}`}
                  href={`/tools/category/${category.slug}`}
                  className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group"
                >
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </span>
                  <span className="text-sm text-purple-600 font-bold">
                    {category.count}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FAQs section - Only on page 1 */}
        {currentPage === 1 &&
          ((faqs && faqs.length > 0) ||
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
