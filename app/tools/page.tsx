// app/tools/page.tsx
import { Suspense } from "react";
import { ToolsContent } from "./ToolsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All AI Tools | Browse 10,000+ AI Tools - Transformik AI",
  description:
    "Browse and discover all AI tools in our comprehensive directory. Find AI tools for writing, coding, marketing, design, and more. Updated daily.",
  alternates: {
    canonical: "https://www.transformik.com/tools",
  },
  openGraph: {
    title: "All AI Tools | Browse 10,000+ AI Tools - Transformik AI",
    description:
      "Browse and discover all AI tools in our comprehensive directory. Find AI tools for writing, coding, marketing, design, and more. Updated daily.",
    url: "https://www.transformik.com/tools",
  },
};

export default function ToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">All AI Tools</h1>
          <p className="text-gray-500">Explore our collection of AI tools.</p>
          <p className="text-gray-500">Loading tools...</p>
        </div>
      }
    >
      <ToolsContent />
    </Suspense>
  );
}
