import { supabaseServer } from "@/utils/supabaseServer";
import { BlogListingContent } from "./BlogListingContent";
import { BlogSchema } from "@/components/schema/BlogSchema";

import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] }>;
}): Promise<Metadata> {
  const sp = (await searchParams) || {};
  const pageParam = sp.page;
  const currentPage = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam || "1",
    10
  );
  const canonicalUrl = `https://www.transformik.com/blog${
    currentPage > 1 ? `?page=${currentPage}` : ""
  }`;

  const baseTitle =
    "AI Blog | Latest AI Insights and Tutorials - Transformik AI";
  const baseDescription =
    "Stay updated with the latest AI insights, tutorials, and trends. Explore our comprehensive blog covering AI tools, techniques, and industry developments.";

  const title =
    currentPage > 1 ? `${baseTitle} - Page ${currentPage}` : baseTitle;
  const description =
    currentPage > 1
      ? `Continue reading the latest insights, tutorials, and trends in artificial intelligence and AI tools.`
      : baseDescription;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

export const revalidate = 0; // Always fetch fresh content for blogs

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

    console.log(
      `Successfully fetched ${data?.length || 0} blogs from Supabase`
    );
    return data || [];
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return [];
  }
}

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string | string[] }>;
}) {
  const blogs = await getBlogs();

  // FAQs for Blog Listing page - SEO optimized
  const blogFaqs = [
    {
      question: "What topics are typically covered in AI blogs?",
      answer:
        "AI blogs typically cover machine learning fundamentals, deep learning techniques, natural language processing, computer vision, AI tool tutorials, industry applications, research breakthroughs, programming guides, data science methodologies, and emerging AI technologies. Content ranges from beginner explanations to advanced technical implementations and real-world case studies.",
    },
    {
      question: "How can I stay current with AI developments and trends?",
      answer:
        "To stay current with AI developments, regularly read reputable AI blogs, follow AI researchers and practitioners on social media, subscribe to AI newsletters, attend virtual conferences and webinars, participate in AI communities and forums, and explore academic papers and research publications. Consistent learning helps track the rapidly evolving AI landscape.",
    },
    {
      question: "What should beginners look for in AI educational content?",
      answer:
        "Beginners should look for content that explains concepts in simple terms, provides step-by-step tutorials, includes practical examples, offers hands-on exercises, covers foundational mathematics, and progresses from basic to intermediate topics. Quality educational content should be well-structured, regularly updated, and include resources for further learning.",
    },
    {
      question: "How do I learn to use AI tools effectively?",
      answer:
        "To learn AI tools effectively, start with official documentation and tutorials, practice with real projects, join user communities and forums, watch video demonstrations, experiment with different use cases, read comparative reviews, and gradually progress from basic to advanced features. Hands-on practice is essential for mastering any AI tool.",
    },
    {
      question: "What should I consider when comparing AI tools?",
      answer:
        "When comparing AI tools, evaluate factors such as ease of use, pricing models, feature sets, accuracy and performance, integration capabilities, customer support, documentation quality, community support, scalability, and specific use case suitability. Consider both current needs and future requirements when making decisions.",
    },
    {
      question:
        "How can I find reliable information about AI tools and techniques?",
      answer:
        "Find reliable AI information through peer-reviewed research papers, established AI blogs and publications, official tool documentation, university courses, professional AI communities, expert reviews, and hands-on testing. Cross-reference multiple sources and prioritize content from recognized experts and institutions in the field.",
    },
    {
      question: "What are the best practices for learning AI concepts?",
      answer:
        "Best practices for learning AI include starting with fundamental concepts, combining theoretical knowledge with practical application, working on projects that interest you, joining study groups or online communities, staying consistent with learning schedules, and keeping up with current research and developments in your areas of interest.",
    },
    {
      question: "How can I evaluate the credibility of AI-related content?",
      answer:
        "Evaluate AI content credibility by checking author credentials and expertise, verifying claims with multiple sources, looking for peer review or citations, assessing the recency of information, examining methodology in reviews or tutorials, and testing recommendations yourself when possible. Be cautious of overly promotional or biased content.",
    },
  ];

  return (
    <>
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

      <BlogListingContent
        initialBlogs={blogs}
        faqs={blogFaqs}
        initialPage={await getInitialPage(searchParams)}
        showDescription={(await getInitialPage(searchParams)) === 1}
      />
    </>
  );
}

async function getInitialPage(
  searchParams?: Promise<{ page?: string | string[] }>
): Promise<number> {
  if (!searchParams) return 1;
  const sp = await searchParams;
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  return rawPage ? Math.max(parseInt(rawPage, 10) || 1, 1) : 1;
}
