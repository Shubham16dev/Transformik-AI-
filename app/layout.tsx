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

export const metadata: Metadata = {
  title: "Transformik AI - Discover 10,000+ AI Tools | AI Tools Hub",
  description:
    "Discover 10,000+ AI tools with blogs and reviews. Find the best AI tools for your needs across all categories.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Transformik AI - Discover AI Tools",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transformik AI - Discover 10,000+ AI Tools",
    description:
      "Discover 10,000+ AI tools with blogs and reviews. Find the best AI tools for your needs across all categories.",
    images: ["/og-image.png"],
  },
  manifest: "/site.webmanifest",
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
        <link
          rel="icon"
          href="/favicon-96x96.png"
          sizes="96x96"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Make sure these are client components if they have dynamic content */}
        {/* <TopBanner /> */}
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
