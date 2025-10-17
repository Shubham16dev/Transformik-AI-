"use client";

import { useState, useMemo } from "react";
import { HomeBlogCard } from "@/components/blog/HomeBlogCard";
import { FAQSchema } from "@/components/schema/FAQSchema";
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
}

export function BlogListingContent({
  initialBlogs,
  faqs,
}: BlogListingContentProps) {
  const [sortOption, setSortOption] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Hero Section - Full Width */}
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
            Welcome to the Transformik.ai blog, your trusted source for AI
            insights, tutorials, and industry news. We cover everything from
            practical AI tool guides and in-depth reviews to emerging trends in
            artificial intelligence. Whether you&apos;re a beginner exploring AI
            for the first time or an experienced professional staying ahead of
            the curve, our expertly crafted articles provide valuable knowledge
            to help you leverage AI technology effectively in your projects and
            workflows.
          </p>
        </div>
      </section>

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
            onPageChange={setCurrentPage}
          />
        )}

        {/* FAQs Section */}
        {faqs && faqs.length > 0 && (
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
