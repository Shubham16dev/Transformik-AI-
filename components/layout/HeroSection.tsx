"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroSectionProps {
  tools: {
    id: string;
    name: string;
    slug: string;
    one_line_description: string;
  }[];
}

export function HeroSection({ tools }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = query
    ? tools.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <section className="relative bg-[#181828] text-white py-20 w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-600/20" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />

      <div className="relative max-w-7xl mx-auto text-center space-y-8 px-6">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium"
        >
          AI tools for all your needs
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold leading-tight"
        >
          Discover the Best
          <br />
          <span className="text-white/90">AI Tools for Your Business</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
        >
          Find, compare, and choose the perfect AI solutions to transform your workflow.
        </motion.p>

        {/* Search Bar with Dropdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="pt-4 max-w-2xl mx-auto"
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex gap-2 items-center bg-white rounded-full p-2 shadow-lg cursor-text">
                <Input
                  type="text"
                  placeholder="Search AI tools..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(e.target.value.length > 0);
                  }}
                  className="flex-1 rounded-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[#181828] placeholder-gray-500"
                />
                <Button variant="secondary" size="lg" className="rounded-full px-6">
                  Search
                </Button>
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] rounded-xl p-2 bg-white shadow-lg">
              {filtered.length > 0 ? (
                <ul className="space-y-2">
                  {filtered.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-800 text-left"
                        onClick={() => {
                          setQuery("");
                          setOpen(false);
                        }}
                      >
                        <span className="font-medium">{tool.name}</span>
                        <p className="text-xs text-gray-500 truncate">
                          {tool.one_line_description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 px-2">No tools found.</p>
              )}
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
    </section>
  );
}
