"use client";

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
  url?: string;
}

export function FAQSchema({
  faqs,
  title = "Frequently Asked Questions",
  url,
}: FAQSchemaProps) {
  const baseUrl = "https://www.transformik.com";

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: title,
    url: url || `${baseUrl}#faq`,
    mainEntity: faqs.map((faq, index) => ({
      "@type": "Question",
      "@id": `${url || baseUrl}#faq-${index + 1}`,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
        author: {
          "@type": "Organization",
          name: "Transformik AI",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqPageSchema),
      }}
    />
  );
}
