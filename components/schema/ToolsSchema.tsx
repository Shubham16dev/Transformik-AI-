"use client";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";

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

interface ToolsSchemaProps {
  tools: Tool[];
  categoryMeta?: {
    name?: string;
    meta_title?: string;
    description?: string;
    faqs?: { question: string; answer: string }[] | null;
  } | null;
  categorySlug?: string;
  currentPage?: number;
  totalTools?: number;
}

export function ToolsSchema({
  tools,
  categoryMeta,
  categorySlug,
  currentPage = 1,
  totalTools,
}: ToolsSchemaProps) {
  const baseUrl = "https://www.transformik.com";

  // Helper function to get price from pricing model
  const getPriceFromModel = (pricingModel: string): string => {
    switch (pricingModel?.toLowerCase()) {
      case "free":
        return "0";
      case "freemium":
        return "0";
      case "free trial":
        return "0";
      case "premium":
      case "paid":
        return "29.99";
      default:
        return "0";
    }
  };

  // ItemList Schema for the tools collection
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryMeta?.name || "AI Tools Directory",
    description:
      categoryMeta?.description ||
      "Comprehensive collection of AI tools and software applications",
    url: categorySlug
      ? `${baseUrl}/tools/category/${categorySlug}`
      : `${baseUrl}/tools`,
    numberOfItems: totalTools || tools.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: tools.slice(0, 20).map((tool, index) => {
      // normalize logo value to a public URL when possible
      const logoUrl = tool.logo
        ? tool.logo.startsWith("http") || tool.logo.startsWith("/")
          ? tool.logo
          : getPublicImageUrl("Images", `ToolLogos/${tool.logo}`)
        : undefined;

      return {
        "@type": "ListItem",
        position: (currentPage - 1) * 15 + index + 1,
        item: {
          "@type": "SoftwareApplication",
          "@id": `${baseUrl}/tools/${tool.slug}`,
          name: tool.tool_name,
          description: tool.one_line_description,
          url: tool.url || `${baseUrl}/tools/${tool.slug}`,
          applicationCategory: Array.isArray(tool.category)
            ? tool.category.join(", ")
            : tool.category || "Artificial Intelligence",
          applicationSubCategory: "AI Tool",
          operatingSystem: [
            "Web Browser",
            "Windows",
            "macOS",
            "Linux",
            "iOS",
            "Android",
          ],
          softwareVersion: "Latest",
          datePublished: "2025-01-01", // Replace with a static date
          publisher: {
            "@type": "Organization",
            name: "Transformik AI",
            url: "https://www.transformik.com",
          },
          offers: {
            "@type": "Offer",
            price: getPriceFromModel(tool.pricing_model),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            priceValidUntil: "2026-01-01", // Replace with a static date
            category: tool.pricing_model,
          },
          ...(logoUrl && {
            image: {
              "@type": "ImageObject",
              url: logoUrl,
              width: 200,
              height: 200,
              caption: `${tool.tool_name} logo`,
            },
          }),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            ratingCount: 100, // Replace with a static number
            bestRating: "5",
            worstRating: "1",
          },
          potentialAction: {
            "@type": "UseAction",
            target: tool.url || `${baseUrl}/tools/${tool.slug}`,
            name: `Use ${tool.tool_name}`,
          },
        },
      };
    }),
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name:
      categoryMeta?.meta_title || categoryMeta?.name || "AI Tools Directory",
    description:
      categoryMeta?.description ||
      "Explore our comprehensive collection of AI tools and software applications",
    url: categorySlug
      ? `${baseUrl}/tools/category/${categorySlug}`
      : `${baseUrl}/tools`,
    isPartOf: {
      "@type": "WebSite",
      name: "Transformik AI",
      url: baseUrl,
    },
    mainEntity: {
      "@id": categorySlug
        ? `${baseUrl}/tools/category/${categorySlug}#itemlist`
        : `${baseUrl}/tools#itemlist`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: `${baseUrl}/tools`,
        },
        ...(categorySlug
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: categoryMeta?.name || categorySlug.replace(/-/g, " "),
                item: `${baseUrl}/tools/category/${categorySlug}`,
              },
            ]
          : []),
      ],
    },
  };

  // FAQ Schema if FAQs exist
  const faqSchema =
    categoryMeta?.faqs && categoryMeta.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: categoryMeta.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}
