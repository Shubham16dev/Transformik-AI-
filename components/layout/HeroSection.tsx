"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative bg-[#181828] text-white py-20 w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-purple-600/20" />
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
      </div>
    </section>
  );
}
