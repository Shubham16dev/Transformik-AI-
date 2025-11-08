// layout.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { HomeHeroWrapper } from "@/components/layout/HomeHeroWrapper";
import { Footer } from "@/components/layout/Footer";
import { CategoryHeroWrapper } from "@/components/category/CategoryHeroWrapper";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import "./globals.css";
import BreadcrumbsClient from "@/components/layout/Breadcrumb";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TopBanner from "@/components/layout/TopBanner";

export const metadata: Metadata = {
  title: "Transformik AI - Discover 10,000+ AI Tools | AI Tools Hub",
  description:
    "Discover 10,000+ AI tools with blogs and reviews. Find the best AI tools for your needs across all categories.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL("https://www.transformik.com"),
  alternates: {
    canonical: "https://www.transformik.com",
  },
  openGraph: {
    title: "Transformik AI - Discover 10,000+ AI Tools",
    description:
      "Discover 10,000+ AI tools with blogs and reviews. Find the best AI tools for your needs across all categories.",
    url: "https://www.transformik.com",
    siteName: "Transformik AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transformik AI - Discover 10,000+ AI Tools",
    description:
      "Discover 10,000+ AI tools with blogs and reviews. Find the best AI tools for your needs across all categories.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Make sure these are client components if they have dynamic content */}
        <TopBanner />
        <Navbar />
        <HomeHeroWrapper />
        <CategoryHeroWrapper />

        <BreadcrumbsClient />

        <main className="flex-grow w-full max-w-7xl mx-auto p-4">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  );
}
