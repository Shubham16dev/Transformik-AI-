/**
 * Structured Data Schema for Homepage
 * Provides rich snippets for search engines
 */

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description: string;
  url: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

interface HomePageSchemaProps {
  latestTools: Tool[];
  latestBlogs: Blog[];
}

export function HomePageSchema({
  latestTools,
  latestBlogs,
}: HomePageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Transformik AI",
    url: "https://www.transformik.com",
    description:
      "Discover 10,000+ AI tools with blogs and reviews. Find the best AI tools for your needs across all categories.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.transformik.com/tools?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Latest AI Tools",
      numberOfItems: latestTools.length,
      itemListElement: latestTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.tool_name,
          url: `https://www.transformik.com/tools/${tool.slug}`,
          description: tool.one_line_description,
          applicationCategory: "AI Tool",
        },
      })),
    },
    hasPart: {
      "@type": "Blog",
      name: "Transformik AI Blog",
      url: "https://www.transformik.com/blog",
      blogPost: latestBlogs.map((blog) => ({
        "@type": "BlogPosting",
        headline: blog.title,
        url: `https://www.transformik.com/blog/${blog.slug}`,
        description: blog.excerpt,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
