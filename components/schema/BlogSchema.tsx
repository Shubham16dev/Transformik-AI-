"use client";

interface BlogSchemaProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    author?: string;
    created_at: string;
    featured_image?: string;
    image?: string;
    cover_image?: string;
    category?: string;
  };
  content?: string;
  isListingPage?: boolean;
  blogs?: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    author?: string;
    created_at: string;
    featured_image?: string;
    image?: string;
    cover_image?: string;
    category?: string;
  }>;
}

export function BlogSchema({
  blog,
  content,
  isListingPage = false,
  blogs = [],
}: BlogSchemaProps) {
  const baseUrl = "https://www.transformik.com";

  // For individual blog post
  if (!isListingPage && blog) {
    const blogPostSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${baseUrl}/blog/${blog.slug}`,
      headline: blog.title,
      description: blog.excerpt || blog.title,
      articleBody: content || blog.excerpt || "",
      url: `${baseUrl}/blog/${blog.slug}`,
      datePublished: blog.created_at,
      dateModified: blog.created_at,
      author: {
        "@type": "Person",
        name: blog.author || "Transformik AI Team",
        url: `${baseUrl}/about`,
      },
      publisher: {
        "@type": "Organization",
        name: "Transformik AI",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/Logo_favicon.svg`,
          width: 512,
          height: 512,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${blog.slug}`,
      },
      ...(blog.featured_image || blog.image || blog.cover_image
        ? {
            image: {
              "@type": "ImageObject",
              url: blog.featured_image || blog.image || blog.cover_image,
              width: 1200,
              height: 630,
              caption: blog.title,
            },
          }
        : {}),
      articleSection: blog.category || "AI Tools",
      keywords: [
        "AI tools",
        "artificial intelligence",
        "technology",
        "software",
        ...(blog.category ? [blog.category] : []),
      ],
      wordCount: content ? content.split(" ").length : 500,
      inLanguage: "en-US",
      copyrightHolder: {
        "@type": "Organization",
        name: "Transformik AI",
      },
      copyrightYear: new Date(blog.created_at).getFullYear(),
      isPartOf: {
        "@type": "Blog",
        name: "Transformik AI Blog",
        url: `${baseUrl}/blog`,
      },
    };

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: blog.title,
      description: blog.excerpt || blog.title,
      url: `${baseUrl}/blog/${blog.slug}`,
      isPartOf: {
        "@type": "WebSite",
        name: "Transformik AI",
        url: baseUrl,
      },
      mainEntity: {
        "@id": `${baseUrl}/blog/${blog.slug}#article`,
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
            name: "Blog",
            item: `${baseUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: blog.title,
            item: `${baseUrl}/blog/${blog.slug}`,
          },
        ],
      },
    };

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
            __html: JSON.stringify(blogPostSchema),
          }}
        />
      </>
    );
  }

  // For blog listing page
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Transformik AI Blog",
    description:
      "Latest insights, tutorials, and trends in AI tools and artificial intelligence",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Transformik AI",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/Logo_favicon.svg`,
        width: 512,
        height: 512,
      },
    },
    inLanguage: "en-US",
    blogPost: blogs.slice(0, 10).map((blogPost) => ({
      "@type": "BlogPosting",
      "@id": `${baseUrl}/blog/${blogPost.slug}`,
      headline: blogPost.title,
      description: blogPost.excerpt || blogPost.title,
      url: `${baseUrl}/blog/${blogPost.slug}`,
      datePublished: blogPost.created_at,
      author: {
        "@type": "Person",
        name: blogPost.author || "Transformik AI Team",
      },
      ...(blogPost.featured_image || blogPost.image || blogPost.cover_image
        ? {
            image: {
              "@type": "ImageObject",
              url:
                blogPost.featured_image ||
                blogPost.image ||
                blogPost.cover_image,
              width: 1200,
              height: 630,
            },
          }
        : {}),
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Blog | Latest AI Insights and Tutorials",
    description:
      "Stay updated with the latest AI insights, tutorials, and trends. Learn about AI tools, machine learning, and artificial intelligence developments.",
    url: `${baseUrl}/blog`,
    isPartOf: {
      "@type": "WebSite",
      name: "Transformik AI",
      url: baseUrl,
    },
    mainEntity: {
      "@id": `${baseUrl}/blog#blog`,
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
          name: "Blog",
          item: `${baseUrl}/blog`,
        },
      ],
    },
  };

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
          __html: JSON.stringify(blogListSchema),
        }}
      />
    </>
  );
}
