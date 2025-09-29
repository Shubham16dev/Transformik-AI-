import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { HomeHeroWrapper } from "@/components/layout/HomeHeroWrapper";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tools Hub",
  description: "Discover 10,000+ AI tools with blogs and reviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Navbar stays full width */}
        <Navbar />

        {/* Hero section on home page */}
        <HomeHeroWrapper />

        {/* Main content with consistent width */}
        <main className="flex-grow w-full max-w-7xl mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
