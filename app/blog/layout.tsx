import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Blog | Latest AI Insights and Tutorials - Transformik AI",
  description:
    "Stay updated with the latest AI insights, tutorials, and trends. Learn about AI tools, machine learning, and artificial intelligence developments.",
  alternates: {
    canonical: "https://www.transformik.com/blog",
  },
  openGraph: {
    title: "AI Blog | Latest AI Insights and Tutorials - Transformik AI",
    description:
      "Stay updated with the latest AI insights, tutorials, and trends. Learn about AI tools, machine learning, and artificial intelligence developments.",
    url: "https://www.transformik.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
