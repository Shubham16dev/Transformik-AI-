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
  showDescription?: boolean;
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

export function FreeToolsContent({
  tools,
  categories,
  faqs,
  initialPage = 1,
  showDescription = false,
}: FreeToolsContentProps) {
  const router = useRouter();

  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortMode, setSortMode] = useState<string>("alpha-asc");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Filter, search & sort
  useEffect(() => {
    let temp = [...tools];

    if (selectedCategory && selectedCategory !== "all") {
      temp = temp.filter((tool) => {
        const categories = tool.category;

        if (Array.isArray(categories)) {
          return categories.some(
            (cat) =>
              cat &&
              typeof cat === "string" &&
              cat.toLowerCase().replace(/\s+/g, "-") === selectedCategory
          );
        } else if (typeof categories === "string" && categories) {
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
    // Don't reset currentPage here - let the separate useEffect handle it
  }, [search, selectedCategory, sortMode, tools]);

  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Update URL when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    const pathname = window.location.pathname || "/free-tools";
    const queryString = params.toString();
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(target, { scroll: false });
  };

  // Reset to page 1 when filters change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    setCurrentPage(1);
    // Update URL to remove page parameter when going back to page 1
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    const pathname = window.location.pathname || "/free-tools";
    const queryString = params.toString();
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(target, { scroll: false });
  }, [search, selectedCategory, sortMode, isInitialMount, router]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
            options={sortOptions.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            placeholder="Sort tools"
            value={sortMode}
            onChange={setSortMode}
          />
        </div>

        {/* Tools Grid */}
        {paginatedTools.length === 0 ? (
          <p className="text-gray-500">No free tools found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedTools.map((tool) => {
              const logoUrl = tool.logo
                ? getPublicImageUrl("Images", `ToolLogos/${tool.logo}`)
                : undefined;

              return (
                <div key={tool.id} className="flex flex-col">
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
        <Pagination
          totalItems={filteredTools.length}
          pageSize={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

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
