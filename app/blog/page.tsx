import { supabaseServer } from "@/utils/supabaseServer";
import { BlogListingContent } from "./BlogListingContent";
import { BlogSchema } from "@/components/schema/BlogSchema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Blog | Latest AI Insights and Tutorials - Transformik AI",
  description:
    "Stay updated with the latest AI insights, tutorials, and trends. Explore our comprehensive blog covering AI tools, techniques, and industry developments.",
  alternates: {
    canonical: "https://www.transformik.com/blog",
  },
  openGraph: {
    title: "AI Blog | Latest AI Insights and Tutorials - Transformik AI",
    description:
      "Stay updated with the latest AI insights, tutorials, and trends. Explore our comprehensive blog covering AI tools, techniques, and industry developments.",
    url: "https://www.transformik.com/blog",
  },
};

export const revalidate = 3600; // Revalidate every hour

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

async function getBlogs(): Promise<BlogSummary[]> {
  try {
    const { data, error } = await supabaseServer
      .from("blogs_summary")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return [];
  }
}

export default async function BlogListingPage() {
  const blogs = await getBlogs();

  // Get current page from search params (for SSR)
  // Next.js 13+ app router: use searchParams in page function
  // Fallback to page 1 if not present
  let currentPage = 1;
  if (typeof window === "undefined") {
    // On server, get from process.env or leave as 1 (for static export)
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get("page") || "1", 10);
  }

  // FAQs for Blog Listing page - SEO optimized
  const blogFaqs = [
    {
      question: "What topics does the Transformik AI blog cover?",
      answer:
        "Our AI blog covers a comprehensive range of topics including AI tool reviews and comparisons, machine learning tutorials, artificial intelligence industry trends, practical AI implementation guides, automation strategies, ChatGPT and GPT-4 insights, AI for business applications, coding with AI assistants, and emerging AI technologies. We provide both beginner-friendly content and advanced technical articles.",
    },
    {
      question: "How often is the blog updated with new AI content?",
      answer:
        "We regularly publish new blog posts and updates to keep you informed about the rapidly evolving AI landscape. Our content calendar includes weekly articles covering the latest AI tools, industry news, tutorials, and practical guides. We also update existing articles to reflect new developments and improvements in AI technology.",
    },
    {
      question: "Are the AI tutorials suitable for beginners?",
      answer:
        "Yes, our blog features content for all skill levels. We have beginner-friendly tutorials that explain AI concepts in simple terms, step-by-step guides for getting started with AI tools, and more advanced articles for experienced users. Each article clearly indicates its difficulty level to help you find content that matches your expertise.",
    },
    {
      question: "Can I learn how to use specific AI tools from your blog?",
      answer:
        "Absolutely! We publish detailed tutorials and guides on popular AI tools including ChatGPT, Midjourney, Stable Diffusion, GitHub Copilot, and many others. Our articles include practical examples, use cases, tips and tricks, feature comparisons, and best practices to help you maximize the potential of AI tools in your work and projects.",
    },
    {
      question: "Do you review and compare different AI tools?",
      answer:
        "Yes, we provide comprehensive AI tool reviews and comparisons. Our articles evaluate features, pricing, performance, use cases, and pros/cons of various AI tools. We compare similar tools side-by-side to help you make informed decisions about which AI solutions best fit your needs and budget.",
    },
    {
      question: "How can I stay updated with new blog posts?",
      answer:
        "You can stay updated by bookmarking our blog page and checking back regularly, following us on social media platforms where we share new articles, or visiting our website frequently as we publish new content weekly. Our blog is updated with fresh AI insights, tutorials, and industry news on an ongoing basis.",
    },
    {
      question: "Can I suggest topics for future blog posts?",
      answer:
        "Yes, we welcome topic suggestions from our readers! If there's a specific AI tool you'd like us to review, a tutorial you need, or an AI topic you want us to cover, please contact us through our website. We value community feedback and often create content based on reader requests and interests.",
    },
    {
      question: "Are the blog articles based on real testing and experience?",
      answer:
        "Yes, our blog content is based on hands-on testing, real-world experience, and thorough research. We actually use and evaluate the AI tools we write about, ensuring our reviews, tutorials, and recommendations are practical, accurate, and valuable. We maintain editorial integrity by providing honest assessments and practical insights.",
    },
  ];

  return (
    <>
      {/* Canonical tag for paginated pages */}
      <head>
        <link
          rel="canonical"
          href={`https://www.transformik.com/blog${
            currentPage > 1 ? `?page=${currentPage}` : ""
          }`}
        />
      </head>
      {/* Schema Markup */}
      <BlogSchema
        isListingPage={true}
        blogs={blogs}
        blog={{
          id: "blog-listing",
          title: "AI Blog | Latest AI Insights and Tutorials",
          slug: "blog",
          excerpt:
            "Stay updated with the latest AI insights, tutorials, and trends",
          created_at: "2024-01-01T00:00:00.000Z", // Static date for listing page
        }}
      />

      <BlogListingContent initialBlogs={blogs} faqs={blogFaqs} />
    </>
  );
}
