// app/tools/page.tsx
import { supabaseServer } from "@/utils/supabaseServer";
import { ToolsContent } from "./ToolsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All AI Tools | Browse 10,000+ AI Tools - Transformik AI",
  description:
    "Browse and discover all AI tools in our comprehensive directory. Find AI tools for writing, coding, marketing, design, and more. Updated daily.",
  alternates: {
    canonical: "https://www.transformik.com/tools",
  },
  openGraph: {
    title: "All AI Tools | Browse 10,000+ AI Tools - Transformik AI",
    description:
      "Browse and discover all AI tools in our comprehensive directory. Find AI tools for writing, coding, marketing, design, and more. Updated daily.",
    url: "https://www.transformik.com/tools",
  },
};

export const revalidate = 3600; // Revalidate every hour

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

// SEO-optimized FAQs for All AI Tools page
const allToolsFaqs = [
  {
    question: "What types of AI tools can I find on Transformik AI?",
    answer:
      "Transformik AI features over 10,000 AI tools across various categories including content writing, image generation, coding assistants, video editing, marketing automation, data analysis, chatbots, transcription, SEO tools, and more. We cover both free and premium tools to suit different needs and budgets.",
  },
  {
    question: "How do I choose the right AI tool for my needs?",
    answer:
      "Start by using our category filters to narrow down tools by use case. Then, use the search function to find specific features you need. Each tool listing includes pricing information, key features, and user reviews to help you make an informed decision. You can also filter by pricing model (Free, Freemium, Premium) to match your budget.",
  },
  {
    question: "Are all the AI tools listed on Transformik free to use?",
    answer:
      "No, we feature a mix of free, freemium, and premium AI tools. Use the pricing filter to show only free tools, or visit our dedicated Free Tools page. Many premium tools offer free trials or free tiers with limited features, allowing you to test them before committing.",
  },
  {
    question: "How often is the AI tools directory updated?",
    answer:
      "Our directory is updated daily with new AI tools and features. We continuously monitor the AI landscape to ensure you have access to the latest and most innovative tools. Tool information is automatically revalidated every hour to keep pricing and feature details current.",
  },
  {
    question: "Can I suggest an AI tool to be added to the directory?",
    answer:
      "Yes! We welcome tool submissions from developers and users. Visit our Contact page to suggest new AI tools. We review all submissions and add tools that meet our quality standards and provide value to our users.",
  },
  {
    question: "How do I filter AI tools by category or pricing?",
    answer:
      "Use the filter options above the tools grid. You can filter by category to see tools for specific use cases (like 'AI Writing' or 'AI Image Generation'), by pricing model (Free, Freemium, Premium), and use the search bar to find tools by name or keyword.",
  },
  {
    question: "Do you provide reviews or ratings for AI tools?",
    answer:
      "Yes, each tool page includes detailed information about features, pros and cons, use cases, and how to use the tool. We also publish in-depth blog posts reviewing popular AI tools and comparing similar options to help you make the best choice.",
  },
  {
    question: "Can I use multiple AI tools together?",
    answer:
      "Absolutely! Many users combine different AI tools to create powerful workflows. For example, using an AI writing tool with an SEO analyzer and image generator. Check our blog for workflow guides and tool integration tips.",
  },
];

async function getTools(): Promise<Tool[]> {
  try {
    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select("*")
      .order("tool_name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching tools:", err);
    return [];
  }
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string | string[] }>;
}) {
  const tools = await getTools();

  // Extract unique categories
  const allCategories: string[] = [];
  tools.forEach((tool) => {
    const toolCategories = tool.category;
    if (Array.isArray(toolCategories)) {
      toolCategories.forEach((cat) => cat && allCategories.push(cat));
    } else if (typeof toolCategories === "string" && toolCategories) {
      allCategories.push(toolCategories);
    }
  });
  const categories = Array.from(new Set(allCategories)).sort();

  const sp = (await searchParams) || {};
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const initialPage = rawPage ? Math.max(parseInt(rawPage, 10) || 1, 1) : 1;

  return (
    <ToolsContent
      tools={tools}
      categories={categories}
      faqs={allToolsFaqs}
      showDescription={true}
      initialPage={initialPage}
    />
  );
}
