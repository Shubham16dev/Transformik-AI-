"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { ToolCard } from "@/components/tools/ToolCard";
import { FilterCombobox } from "@/components/ui/FilterCombobox";
import { Pagination } from "@/components/Pagination";
import { FAQSchema } from "@/components/schema/FAQSchema";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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

interface FreeToolsContentProps {
  tools: Tool[];
  categories: CategoryOption[];
  faqs?: { question: string; answer: string }[];
  initialPage?: number;
  totalPages?: number;
  totalTools?: number;
  initialSearch?: string;
  initialCategory?: string;
  initialSortMode?: string;
  showDescription?: boolean;
}

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

export function FreeToolsContent({
  tools,
  categories,
  faqs,
  initialPage = 1,
  totalPages: serverTotalPages = 1,
  totalTools: serverTotalTools = 0,
  initialSearch = "",
  initialCategory = "all",
  initialSortMode = "alpha-asc",
  showDescription = false,
}: FreeToolsContentProps) {
  const router = useRouter();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [sortMode, setSortMode] = useState<string>(initialSortMode);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update URL when filters change - triggers server-side refetch
  const updateURL = (newFilters: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();

    const finalSearch = newFilters.search ?? search;
    const finalCategory = newFilters.category ?? selectedCategory;
    const finalSort = newFilters.sort ?? sortMode;
    const finalPage = newFilters.page ?? currentPage;

    if (finalSearch) params.set("search", finalSearch);
    if (finalCategory && finalCategory !== "all")
      params.set("category", finalCategory);
    if (finalSort && finalSort !== "alpha-asc") params.set("sort", finalSort);
    if (finalPage > 1) params.set("page", finalPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/free-tools?${queryString}` : "/free-tools";
    router.push(newUrl);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    updateURL({ search: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    updateURL({ category: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSortMode(value);
    setCurrentPage(1);
    updateURL({ sort: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Use server-provided data directly
  const displayTools = tools;
  const totalPages = serverTotalPages;
  const totalItems = serverTotalTools;

  return (
    <>
      {/* Hero Section - Full Width */}
      <section className="relative bg-[#181828] text-white py-16 w-screen -ml-[50vw] left-1/2  overflow-hidden mb-8">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-purple-600/20" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />

        <div className="relative w-full mx-auto text-center space-y-6 px-6">
          {/* Top badge */}
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
            100% Free AI Tools
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Free AI Tools
          </h1>

          <p className="text-lg md:text-xl text-white/80 w-full mx-auto leading-relaxed">
            {showDescription
              ? "Access completely free AI tools without any payment, subscription, or credit card requirements. This comprehensive directory includes AI-powered solutions for content creation, code generation, image editing, data analysis, marketing automation, and productivity enhancement. Every tool listed offers genuine free functionality - no trials or freemium limitations. Perfect for developers, marketers, students, and businesses seeking cost-effective AI solutions to streamline workflows and boost productivity."
              : "Access 100+ free AI tools for content creation, coding, design, marketing, and productivity - no payment required."}
          </p>
        </div>
      </section>

      <div className="space-y-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            aria-label="Search free tools"
            placeholder="Search free tools..."
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
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />

          {isMounted && (
            <>
              <FilterCombobox
                options={categories}
                placeholder="Filter by category"
                value={selectedCategory}
                onChange={handleCategoryChange}
              />

              <FilterCombobox
                options={sortOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                placeholder="Sort tools"
                value={sortMode}
                onChange={handleSortChange}
              />
            </>
          )}
        </div>

        {/* Tools Grid */}
        {isMounted && displayTools.length === 0 ? (
          <p className="text-gray-500">No free tools found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isMounted &&
              displayTools.map((tool, index) => {
                const logoUrl = tool.logo
                  ? getPublicImageUrl("Images", `ToolLogos/${tool.logo}`)
                  : undefined;

                return (
                  <div key={`${tool.id}-${index}`} className="flex flex-col">
                    <ToolCard
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
                  </div>
                );
              })}
          </div>
        )}

        {/* Pagination */}
        {isMounted && totalPages > 1 && (
          <Pagination
            totalItems={totalItems}
            pageSize={9}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* FAQs Section - Only on page 1 */}
        {currentPage === 1 && faqs && faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, idx) => (
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
            <FAQSchema faqs={faqs} />
          </section>
        )}
      </div>
    </>
  );
}
