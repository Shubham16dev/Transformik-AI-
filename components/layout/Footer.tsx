"use client";

import { useEffect, useState } from "react";
import { FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabase";

function generateSlug(category: string) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function Footer() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("tools_summary")
        .select("category");
      if (!error && data) {
        const allCategories: string[] = [];
        data.forEach((tool) => {
          const cat = tool.category;
          if (Array.isArray(cat))
            cat.forEach((c) => c && allCategories.push(c));
          else if (typeof cat === "string" && cat) allCategories.push(cat);
        });
        setCategories(Array.from(new Set(allCategories))); // unique
      }
    };
    fetchCategories();
  }, []);

  const socialLinks = [
    {
      href: "https://www.youtube.com/@Transformik",
      icon: <FaYoutube />,
      label: "YouTube",
    },
    {
      href: "https://www.instagram.com/transformikai/",
      icon: <FaInstagram />,
      label: "Instagram",
    },
    {
      href: "https://www.linkedin.com/company/transformik",
      icon: <FaLinkedin />,
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-[#181828] text-white pt-10 pb-6 px-6 md:px-16">
      {" "}
      <div className="max-w-7xl mx-auto">
        {/* Top section */}{" "}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#23233a] pb-8 mb-8 gap-6">
          {" "}
          <div className="flex items-center gap-4">
            {" "}
            <Image
              src="/images/TransformikLogo.png"
              alt="Transformik AI"
              width={230}
              height={230}
              className="object-contain"
              unoptimized
            />{" "}
          </div>{" "}
          <div className="flex gap-6 text-2xl">
            {socialLinks.map((social) => (
              <motion.a
                key={social.href}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-white"
              >
                {social.icon}
              </motion.a>
            ))}{" "}
          </div>{" "}
        </div>
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {/* About */}
          <div className="md:pr-12">
            <h3 className="font-semibold text-xl mb-3">About Transformik AI</h3>
            <p className="text-white mb-4 leading-relaxed">
              Discover cutting-edge AI tools and resources to transform your
              workflow. From AI generators to productivity enhancers, we curate
              the best AI solutions.
            </p>
            <p className="text-white text-sm">
              Contact:{" "}
              <a
                href="mailto:singhalharsh187@gmail.com"
                className="relative hover:text-gray-300 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                singhalharsh187@gmail.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:px-8">
            <h3 className="font-semibold text-xl mb-3">Quick Links</h3>
            <ul className="space-y-2 text-white">
              {[
                { href: "/", label: "Home" },
                { href: "/tools", label: "All AI Tools" },
                { href: "/tools/category", label: "AI Tools Categories" },
                { href: "/free-tools", label: "Free AI Tools" },
                { href: "/blog", label: "Blogs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative hover:text-gray-300 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Categories */}
          <div className="md:pl-12">
            <h3 className="font-semibold text-xl mb-3">Top AI Categories</h3>
            <ul className="space-y-2 text-white">
              {categories.slice(0, 4).map((category) => {
                const slug = generateSlug(category);
                return (
                  <li key={category}>
                    <Link
                      href={`/tools/category/${slug}`}
                      className="relative hover:text-gray-300 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {category}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/tools/category"
                  className="relative hover:text-gray-300 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-white after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                >
                  All Categories →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="text-center text-[#8ca0b3] text-sm">
            © {new Date().getFullYear()} Transformik AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
