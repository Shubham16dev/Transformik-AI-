"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HomeBlogCard } from "@/components/blog/HomeBlogCard";
import { FAQSchema } from "@/components/schema/FAQSchema";
import { PaginationSEO } from "@/components/PaginationSEO";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/Pagination";

interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  featured_image?: string;
  author?: string;
  created_at: string;
}

interface BlogListingContentProps {
  initialBlogs: BlogSummary[];
  faqs?: { question: string; answer: string }[];
  initialPage?: number;
  totalPages?: number;
  totalBlogs?: number;
  initialSortOption?: string;
  showDescription?: boolean;
}

export function BlogListingContent({
  initialBlogs,
  faqs,
  initialPage = 1,
  totalPages: serverTotalPages = 1,
  totalBlogs: serverTotalBlogs = 0,
  initialSortOption = "date-desc",
  showDescription = false,
}: BlogListingContentProps) {
  const router = useRouter();
  const [sortOption, setSortOption] = useState(initialSortOption);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isMounted, setIsMounted] = useState(false);

  const pageSize = 8; // Blogs per page

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update URL when filters change
  const updateURL = (newFilters: { sort?: string; page?: number }) => {
    const params = new URLSearchParams();

    const finalSort = newFilters.sort ?? sortOption;
    const finalPage = newFilters.page ?? currentPage;

    if (finalSort && finalSort !== "date-desc") params.set("sort", finalSort);
    if (finalPage > 1) params.set("page", finalPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/blog?${queryString}` : "/blog";
    router.push(newUrl);
  };

  // Update URL when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
    updateURL({ sort: value, page: 1 });
  };

  // Use server-provided data directly
  const displayBlogs = initialBlogs;
  const totalPages = serverTotalPages;

  return (
    <>
      {/* SEO Pagination Links */}
      <PaginationSEO
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="https://www.transformik.com/blog"
      />

      {/* Hero Section - Only on page 1 */}
      {currentPage === 1 && (
        <section className="relative bg-[#181828] text-white py-16 w-screen -ml-[50vw] left-1/2 relative overflow-hidden mb-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-purple-600/20" />
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />

          <div className="relative w-full mx-auto text-center space-y-6 px-6">
            {/* Top badge */}
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
              AI Insights & Tutorials
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              AI Blog
            </h1>

            <p className="text-lg md:text-xl text-white/80 w-full mx-auto leading-relaxed">
              {showDescription
                ? "Discover comprehensive AI insights, expert tutorials, and the latest artificial intelligence trends. Our in-depth blog covers machine learning guides, AI tool reviews, automation strategies, and emerging technologies. From beginner-friendly AI tutorials to advanced implementation guides, we help businesses and professionals harness the power of artificial intelligence to drive innovation and growth."
                : "Your ultimate resource for AI insights, tutorials, and industry expertise."}
            </p>
          </div>
        </section>
      )}

      <div className="space-y-6">
        {/* Sort Select */}
        <div className="flex justify-end">
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isMounted && displayBlogs.length > 0 ? (
            displayBlogs.map((blog) => (
              <HomeBlogCard key={blog.id} blog={blog} />
            ))
          ) : isMounted ? (
            <p className="text-gray-500">No blogs found.</p>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>

        {/* Pagination */}
        {isMounted && totalPages > 1 && (
          <Pagination
            totalItems={serverTotalBlogs}
            pageSize={pageSize}
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
