"use client";

export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Transformik AI",
    alternateName: "Transformik",
    url: "https://www.transformik.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.transformik.com/images/Logo_favicon.svg",
      width: 512,
      height: 512,
    },
    description:
      "Discover the best AI tools and software for your needs. Comprehensive directory of 10,000+ AI tools with reviews, categories, and detailed information.",
    foundingDate: "2024",
    slogan: "Discover 10,000+ AI Tools",
    knowsAbout: [
      "Artificial Intelligence",
      "AI Tools",
      "Software Directory",
      "Machine Learning",
      "AI Chatbots",
      "AI Writing Tools",
      "AI Code Assistants",
    ],
    sameAs: [
      "https://twitter.com/transformik",
      "https://linkedin.com/company/transformik",
      "https://github.com/transformik",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: "https://www.transformik.com/contact",
      email: "contact@transformik.com",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    areaServed: "Worldwide",
    serviceType: "AI Tools Directory",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
    />
  );
}
