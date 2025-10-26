"use client";

import { useState, useMemo, useEffect } from "react";
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
  showDescription?: boolean;
}

export function BlogListingContent({
  initialBlogs,
  faqs,
  initialPage = 1,
  showDescription = false,
}: BlogListingContentProps) {
  const router = useRouter();
  const [sortOption, setSortOption] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const pageSize = 8; // Blogs per page

  // Sort blogs using useMemo to prevent hydration issues
  const sortedBlogs = useMemo(() => {
    const sorted = [...initialBlogs];
    if (sortOption === "date-desc") {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "date-asc") {
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    return sorted;
  }, [sortOption, initialBlogs]);

  const totalPages = Math.ceil(sortedBlogs.length / pageSize);
  const paginatedBlogs = sortedBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    if (currentPage !== 1) {
      handlePageChange(1);
    } else {
      setCurrentPage(1);
    }
  };

  // Reset to page 1 when sort changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
  }, [isInitialMount]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedBlogs.length > 0 ? (
            paginatedBlogs.map((blog) => (
              <HomeBlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p className="text-gray-500">No blogs found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            totalItems={sortedBlogs.length}
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
