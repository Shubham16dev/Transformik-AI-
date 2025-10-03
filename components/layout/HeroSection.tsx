"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          AI Services & Solutions for your Business
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold leading-tight"
        >
          Transform your business with
          <br />
          <span className="text-white/90">AI-powered solutions.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
        >
          We design, build, and integrate AI systems that streamline workflows,
          boost productivity, and drive growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
        >
          {/* Explore AI Tools Button */}
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-0 min-w-[200px]"
          >
            <Link href="/tools">Explore All AI Tools</Link>
          </Button>

          {/* Explore Blogs Button */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#181828] font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px]"
          >
            <Link href="/blog">Explore Blogs</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
