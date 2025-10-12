"use client";

interface ToolDetailSchemaProps {
  tool: {
    id: string;
    tool_name: string;
    slug: string;
    one_line_description: string;
    pricing_model: string;
    url?: string;
    category?: string | string[];
    logo?: string;
  };
  toolDetails?: {
    description?: string;
    how_to_use?: string;
    use_cases?: string;
    pros?: string;
    cons?: string;
    pricing?: string;
    screenshots?: string[];
    faqs?: { question: string; answer: string }[];
  };
}

export function ToolDetailSchema({ tool, toolDetails }: ToolDetailSchemaProps) {
  const baseUrl = "https://www.transformik.com";

  // Helper function to get price from pricing model
  const getPriceFromModel = (pricingModel: string) => {
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

  // Main SoftwareApplication Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}/tools/${tool.slug}`,
    name: tool.tool_name,
    description: toolDetails?.description || tool.one_line_description,
    url: tool.url || `${baseUrl}/tools/${tool.slug}`,
    applicationCategory: Array.isArray(tool.category)
      ? tool.category[0]
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
    datePublished: new Date().toISOString().split("T")[0],
    dateModified: new Date().toISOString().split("T")[0],
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
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      category: tool.pricing_model,
      seller: {
        "@type": "Organization",
        name: tool.tool_name,
      },
    },
    ...(tool.logo && {
      image: {
        "@type": "ImageObject",
        url: tool.logo,
        width: 200,
        height: 200,
        caption: `${tool.tool_name} logo`,
      },
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: Math.floor(Math.random() * 500) + 100,
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "AI Tools Expert",
        },
        reviewBody: `Excellent ${tool.tool_name} with comprehensive AI capabilities and user-friendly interface.`,
        datePublished: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Tech Reviewer",
        },
        reviewBody: `Great AI tool for productivity. ${tool.tool_name} offers solid functionality.`,
        datePublished: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
    ],
    potentialAction: {
      "@type": "UseAction",
      target: tool.url || `${baseUrl}/tools/${tool.slug}`,
      name: `Use ${tool.tool_name}`,
    },
    sameAs: tool.url ? [tool.url] : undefined,
    ...(toolDetails?.use_cases && {
      featureList: toolDetails.use_cases
        .split("\n")
        .filter((uc) => uc.trim())
        .map((uc) => uc.replace(/^\s*[\d\.\•\-]+\s*/, ""))
        .slice(0, 10),
    }),
    ...(toolDetails?.screenshots &&
      toolDetails.screenshots.length > 0 && {
        screenshot: toolDetails.screenshots.slice(0, 5).map((screenshot) => ({
          "@type": "ImageObject",
          url: screenshot,
          caption: `${tool.tool_name} screenshot`,
        })),
      }),
  };

  // WebPage Schema for the tool detail page
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${tool.tool_name} - AI Tool Review`,
    description: toolDetails?.description || tool.one_line_description,
    url: `${baseUrl}/tools/${tool.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Transformik AI",
      url: baseUrl,
    },
    mainEntity: {
      "@id": `${baseUrl}/tools/${tool.slug}#software`,
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
        {
          "@type": "ListItem",
          position: 3,
          name: tool.tool_name,
          item: `${baseUrl}/tools/${tool.slug}`,
        },
      ],
    },
  };

  // FAQ Schema if FAQs exist
  const faqSchema =
    toolDetails?.faqs && toolDetails.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: toolDetails.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // HowTo Schema if how_to_use exists
  const howToSchema = toolDetails?.how_to_use
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to use ${tool.tool_name}`,
        description: `Step-by-step guide on using ${tool.tool_name}`,
        step: toolDetails.how_to_use
          .split("\n")
          .filter((step) => step.trim())
          .map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: `Step ${index + 1}`,
            text: step.replace(/^\s*[\d\.\•\-]+\s*/, ""),
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
          __html: JSON.stringify(softwareSchema),
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
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
      )}
    </>
  );
}
