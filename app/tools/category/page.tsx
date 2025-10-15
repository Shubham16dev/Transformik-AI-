"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FAQSchema } from "@/components/schema/FAQSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp10 } from "lucide-react";

interface Category {
  name: string;
  count: number;
  slug: string;
}

// Sort options with icons
const sortOptions = [
  {
    value: "count-desc",
    label: "Most Tools → Least Tools",
    icon: <ArrowDown01 className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "count-asc",
    label: "Least Tools → Most Tools",
    icon: <ArrowUp10 className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "alpha-asc",
    label: "Alphabetical (A → Z)",
    icon: <ArrowDownAZ className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "alpha-desc",
    label: "Alphabetical (Z → A)",
    icon: <ArrowUpAZ className="h-4 w-4 text-purple-600" />,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<string>("alpha-asc");
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  // SEO-friendly FAQs specific to AI tools categories
  const faqs = useMemo(
    () => [
      {
        question: "What are AI tool categories?",
        answer:
          "AI tool categories group similar tools by their primary use cases—such as Content Generation, Image Editing, Coding Assistants, SEO, Marketing, Data Analysis, Transcription, and more—so you can quickly find solutions that match your goals.",
      },
      {
        question: "How do I choose the right AI category for my needs?",
        answer:
          "Start with your objective (e.g., write blog posts, design visuals, analyze data). Then filter categories that align with that goal and sort by popularity or relevance. You can also search within categories to narrow options further.",
      },
      {
        question: "Which AI categories are most popular?",
        answer:
          "Commonly visited categories include Content Writing, Image & Design, Video & Audio, Code Assistants, SEO, Marketing Automation, and Productivity. Popularity can change as new tools emerge.",
      },
      {
        question: "Are the tools in each category free or paid?",
        answer:
          "Many tools offer free tiers alongside paid plans. Category listings often include both—use the tool page to check pricing, features, and usage limits before you commit.",
      },
      {
        question: "Can a single AI tool belong to multiple categories?",
        answer:
          "Yes. Some tools span several use cases (for example, a content suite with image and SEO features). We place tools in all relevant categories to improve discoverability.",
      },
      {
        question: "How often are AI tool categories updated?",
        answer:
          "Categories are refreshed as new tools launch and existing tools add features. We also update counts and ordering to reflect activity and community interest.",
      },
      {
        question: "What does the number next to each category mean?",
        answer:
          "It shows how many tools are currently listed in that category. Use it to gauge breadth—larger counts typically indicate more options to compare.",
      },
      {
        question: "How can I request a new AI category or suggest a tool?",
        answer:
          "If you don't see a category you need or want to recommend a tool, head to our contact page and submit a request with details. We'll review and update the directory accordingly.",
      },
    ],
    []
  );

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);

      const { data: toolsData, error } = await supabase
        .from("tools_summary")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
        return;
      }

      const categoryCount: Record<string, number> = {};

      toolsData?.forEach((tool) => {
        const categories = tool.category;

        if (Array.isArray(categories)) {
          // Handle array of categories
          categories.forEach((cat) => {
            if (cat && typeof cat === "string") {
              categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            }
          });
        } else if (typeof categories === "string" && categories) {
          // Handle single category string
          categoryCount[categories] = (categoryCount[categories] || 0) + 1;
        } else {
          // Handle uncategorized
          categoryCount["Uncategorized"] =
            (categoryCount["Uncategorized"] || 0) + 1;
        }
      });

      const categoryArray: Category[] = Object.entries(categoryCount).map(
        ([name, count]) => ({
          name,
          count,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        })
      );

      setCategories(categoryArray);
      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  // Memoize sorted categories
  const sortedCategories = useMemo(() => {
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortMode === "alpha-asc") return a.name.localeCompare(b.name);
      if (sortMode === "alpha-desc") return b.name.localeCompare(a.name);
      if (sortMode === "count-asc") return a.count - b.count;
      if (sortMode === "count-desc") return b.count - a.count;
      return 0;
    });
  }, [categories, sortMode, search]);

  const currentOption = sortOptions.find((o) => o.value === sortMode);

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
        <input
          type="text"
          aria-label="Search categories"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
        />

        {!isLoading && categories.length > 0 && (
          <Select value={sortMode} onValueChange={setSortMode}>
            <SelectTrigger className="w-[220px] rounded-md border-gray-300 bg-white shadow-sm hover:border-purple-500 transition-all">
              {currentOption ? (
                <div className="flex items-center gap-2">
                  {currentOption.icon}
                  <span>{currentOption.label}</span>
                </div>
              ) : (
                <SelectValue placeholder="Sort categories" />
              )}
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto rounded-xl shadow-lg border border-gray-200">
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={`py-2 ${
                    sortMode === option.value
                      ? "bg-purple-50 text-purple-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="animate-pulse h-20 rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : sortedCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((category) => (
            <Card
              key={category.slug}
              className="hover:shadow-md transition-shadow border border-gray-200 p-4 rounded-xl cursor-pointer"
              onClick={() => router.push(`/tools/category/${category.slug}`)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium text-gray-800">
                  {category.name}
                </h3>
                <span className="text-purple-600 text-base font-semibold">
                  {category.count}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No categories found matching your search.</p>
        </div>
      )}

      {/* FAQ Section */}
      <section id="faq" className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-base text-gray-900 px-0">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed mx-0 px-0">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Structured Data for FAQs */}
      <FAQSchema
        faqs={faqs}
        title="Frequently asked questions"
        url="https://www.transformik.com/tools/category"
      />
    </div>
  );
}
