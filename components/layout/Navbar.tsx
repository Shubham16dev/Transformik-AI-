"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define navigation links outside the component
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "All AI Tools" },
  { href: "/tools/category", label: "AI Tools Categories" },
  { href: "/free-tools", label: "Free AI Tools" },
  { href: "/blog", label: "Blogs" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#181828] shadow-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/images/TransformikLogo.png"
            alt="Transformik Logo"
            width={160}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white font-medium relative transition-colors duration-200 hover:text-gray-300 px-2 py-1 group"
                >
                  {link.label}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Contact Button */}
        <div className="hidden md:block">
          <Button
            asChild
            className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-300"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="text-white focus:outline-none"
                aria-label="Open Mobile Menu"
              >
                <Menu size={28} />
              </button>
            </SheetTrigger>

            <AnimatePresence>
              {isOpen && (
                <SheetContent
                  side="left"
                  className="bg-[#181828] text-white p-6"
                >
                  <SheetHeader>
                    <SheetTitle className="text-white flex items-center">
                      <img
                        src="/images/TransformikLogo.png"
                        alt="Transformik Logo"
                        width={140}
                        height={36}
                        className="object-contain"
                      />
                    </SheetTitle>
                  </SheetHeader>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-4"
                  >
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-white font-medium py-2 border-b border-gray-700 hover:text-gray-300 transition"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}

                    <Button
                      asChild
                      className="mt-4 w-full bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2 rounded-full shadow-lg border border-gray-300"
                    >
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </motion.div>
                </SheetContent>
              )}
            </AnimatePresence>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
