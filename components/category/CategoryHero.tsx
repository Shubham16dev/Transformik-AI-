"use client";

import { motion } from "framer-motion";

export function CategoryHero() {
  return (
    <section className="relative bg-[#181828] text-white py-16 w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-purple-600/20" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg" />

      <div className="relative w-full mx-auto text-center space-y-6 px-6">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium"
        >
          Browse AI Tools by Category
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold leading-tight"
        >
          AI Tools Categories
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-lg md:text-xl text-white/80 w-full mx-auto leading-relaxed"
        >
          Browse AI tools organized by category and functionality. Find machine 
          learning platforms, natural language processing tools, computer vision 
          applications, and automation software. Categories include business 
          automation, data analysis, content creation, image processing, text 
          analysis, and workflow optimization tools for various industries.
        </motion.p>
      </div>
    </section>
  );
}
