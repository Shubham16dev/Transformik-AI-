"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, DollarSign, Share2 } from "lucide-react";

interface Tool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  icon: React.ElementType;
  path: string;
}

// Replace this with your real data
const tools: Tool[] = [
  {
    id: 1,
    name: "Content Repurposer",
    description: "Transform blog posts into 5 social media formats.",
    imageUrl:
      "https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?auto=format&fit=crop&q=80&w=687",
    icon: Share2,
    path: "/inhouse-tools/content-repurposer",
  },
  {
    id: 2,
    name: "Quote Finder",
    description: "Discover and organize authentic quotes instantly",
    imageUrl:
      "https://images.unsplash.com/photo-1699004642562-63a26850d89f?auto=format&fit=crop&q=80&w=764",
    icon: DollarSign,
    path: "/inhouse-tools/quote-finder",
  },
  {
    id: 3,
    name: "Content Calendar",
    description: "Create and organize your social media content plan effortlessly",
    imageUrl:
      "https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?auto=format&fit=crop&q=80&w=687",
    icon: Sparkles,
    path: "/inhouse-tools/content-calendar",
  },
];

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const Icon = tool.icon;

  return (
    <div
      onClick={() => window.open(tool.path, "_blank")}
      className="flex flex-col cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full
                 h-[350px] sm:h-[380px] md:h-[400px] lg:h-[420px]"
    >
      {/* Top half: content */}
      <div className="flex flex-col justify-center gap-2 p-4 bg-white h-1/2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-500" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
          {tool.name}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          {tool.description}
        </p>
      </div>

      {/* Bottom half: image */}
      <div className="relative h-1/2 w-full">
        <Image
          src={tool.imageUrl}
          alt={tool.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Full-width hero */}
      <section className="relative w-screen -ml-[50vw] left-1/2 bg-[#181828] py-24 overflow-hidden text-center text-white mb-12">
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium mb-6">
            100% In-House Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Your AI Tool Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
            Explore a curated collection of in-house AI tools for your team.
            Transform content, calculate API costs, polish outputs, and more.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 2xl:px-16">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
