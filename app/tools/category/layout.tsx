import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools Categories | Browse by Category - Transformik AI",
  description:
    "Browse AI tools by category. Find chatbots, writing assistants, coding tools, marketing tools, and more. Organized categories for easy discovery.",
  alternates: {
    canonical: "https://www.transformik.com/tools/category",
  },
  openGraph: {
    title: "AI Tools Categories | Browse by Category - Transformik AI",
    description:
      "Browse AI tools by category. Find chatbots, writing assistants, coding tools, marketing tools, and more. Organized categories for easy discovery.",
    url: "https://www.transformik.com/tools/category",
  },
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
