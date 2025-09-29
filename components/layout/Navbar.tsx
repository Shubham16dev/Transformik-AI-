"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; // for hamburger icon

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center gap-6">
          {[
            { href: "/", label: "Home" },
            { href: "/tools", label: "All Tools" },
            { href: "/categories", label: "All Categories" },
            { href: "/free-tools", label: "Free Tools" },
            { href: "/blog", label: "Blogs" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white font-medium relative transition-colors duration-200 hover:text-gray-300 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact Us Button (desktop only) */}
        <div className="hidden md:block">
          <Button
            asChild
            className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-300"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#181828] px-6 pb-4 space-y-4">
          {[
            { href: "/", label: "Home" },
            { href: "/tools", label: "All Tools" },
            { href: "/categories", label: "AI Categories" },
            { href: "/free-tools", label: "Free Tools" },
            { href: "/blog", label: "Blogs" },
            { href: "/contact", label: "Contact Us" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-white font-medium py-2 border-b border-gray-700"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
