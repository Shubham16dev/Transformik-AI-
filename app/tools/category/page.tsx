import { supabaseServer } from "@/utils/supabaseServer";
import { CategoriesContent } from "./CategoriesContent";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FAQSchema } from "@/components/schema/FAQSchema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tool Categories | Browse AI Tools by Category - Transformik AI",
  description:
    "Explore AI tools organized by categories. Find tools for content generation, image editing, coding, SEO, marketing, and more. Browse all categories.",
  alternates: {
    canonical: "https://www.transformik.com/tools/category",
  },
  openGraph: {
    title: "AI Tool Categories | Browse AI Tools by Category - Transformik AI",
    description:
      "Explore AI tools organized by categories. Find tools for content generation, image editing, coding, SEO, marketing, and more. Browse all categories.",
    url: "https://www.transformik.com/tools/category",
  },
};

export const revalidate = 0; // Always fetch fresh content

interface Category {
  name: string;
  count: number;
  slug: string;
}

// SEO-friendly FAQs specific to AI tools categories
const faqs = [
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
];

async function getCategories(): Promise<Category[]> {
  try {
    let allTools: { category?: string | string[] | null }[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    // Fetch all tools in batches to ensure we get complete data
    while (hasMore) {
      const { data, error } = await supabaseServer
        .from("tools_summary")
        .select("category")
        .range(from, from + batchSize - 1);

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      if (data && data.length > 0) {
        allTools = [...allTools, ...data];
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }

    // Count tools per category
    const categoryCount: Record<string, number> = {};

    allTools.forEach((tool) => {
      const categories = tool.category;

      if (Array.isArray(categories)) {
        categories.forEach((cat) => {
          if (cat && typeof cat === "string") {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          }
        });
      } else if (typeof categories === "string" && categories) {
        categoryCount[categories] = (categoryCount[categories] || 0) + 1;
      } else {
        categoryCount["Uncategorized"] =
          (categoryCount["Uncategorized"] || 0) + 1;
      }
    });

    // Use Map to ensure unique slugs and merge duplicate slugs
    const categoryMap = new Map<string, Category>();

    Object.entries(categoryCount).forEach(([name, count]) => {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const existing = categoryMap.get(slug);
      if (existing) {
        // Merge counts for duplicate slugs, keep the longer name
        existing.count += count;
        if (name.length > existing.name.length) {
          existing.name = name;
        }
      } else {
        categoryMap.set(slug, { name, count, slug });
      }
    });

    const categoryArray: Category[] = Array.from(categoryMap.values());

    // console.log(`Processed ${categoryArray.length} categories from ${allTools.length} tools`);
    return categoryArray;
  } catch (err) {
    console.error("Error processing categories:", err);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <CategoriesContent categories={categories} />

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
