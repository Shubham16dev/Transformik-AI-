// layout.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { HomeHeroWrapper } from "@/components/layout/HomeHeroWrapper";
import { Footer } from "@/components/layout/Footer";
import { CategoryHeroWrapper } from "@/components/category/CategoryHeroWrapper";
import "./globals.css";
import BreadcrumbsClient from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "AI Tools Hub",
  description: "Discover 10,000+ AI tools with blogs and reviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Make sure these are client components if they have dynamic content */}
        <Navbar />
        <HomeHeroWrapper />
        <CategoryHeroWrapper />

        <BreadcrumbsClient />

        <main className="flex-grow w-full max-w-7xl mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
