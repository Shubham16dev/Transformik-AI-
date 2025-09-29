"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-[#181828] shadow-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold text-white tracking-wide"
        >
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transformik AI
          </span>
        </Link>

        {/* Menu Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-white font-medium relative transition-colors duration-200 hover:text-gray-300 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="text-white font-medium relative transition-colors duration-200 hover:text-gray-300 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
            >
              All Tools
            </Link>
            <Link
              href="/categories"
              className="text-white font-medium relative transition-colors duration-200 hover:text-gray-300 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
            >
              AI Categories
            </Link>
            <Link
              href="/free-tools"
              className="text-white font-medium relative transition-colors duration-200 hover:text-gray-300 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
            >
              Free Tools
            </Link>
            <Link
              href="/blog"
              className="text-white font-medium relative transition-colors duration-200 hover:text-gray-300 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
            >
              Blogs
            </Link>
          </div>
        </div>

        {/* Contact Us Button */}
        <Button
          asChild
          className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-300"
        >
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </nav>
  );
}
