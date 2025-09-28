import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tools Hub",
  description: "Discover 10,000+ AI tools with blogs and reviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        
        <main className="mx-auto max-w-7xl p-4">{children}</main>
      </body>
    </html>
  );
}
