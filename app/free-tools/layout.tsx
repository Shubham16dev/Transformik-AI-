import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Tools | Discover 100% Free AI Tools - Transformik AI",
  description:
    "Discover completely free AI tools for writing, coding, design, marketing, and more. No subscription required. Start using AI tools for free today.",
  alternates: {
    canonical: "https://www.transformik.com/free-tools",
  },
  openGraph: {
    title: "Free AI Tools | Discover 100% Free AI Tools - Transformik AI",
    description:
      "Discover completely free AI tools for writing, coding, design, marketing, and more. No subscription required. Start using AI tools for free today.",
    url: "https://www.transformik.com/free-tools",
  },
};

export default function FreeToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
