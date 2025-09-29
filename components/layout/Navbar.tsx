"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "All Tools" },
    { href: "/categories", label: "All Categories" },
    { href: "/free-tools", label: "Free Tools" },
    { href: "/blog", label: "Blogs" },
  ];

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
        <NavigationMenu className="hidden md:flex flex-1 justify-center">
          <NavigationMenuList className="flex gap-6">
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="text-white font-medium relative transition-colors duration-200 hover:text-[#181828] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

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
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-white focus:outline-none">
                <Menu size={28} />
              </button>
            </SheetTrigger>
            <AnimatePresence>
              {isOpen && (
                <SheetContent side="left" className="bg-[#181828] text-white p-6">
                  <SheetHeader>
                    <SheetTitle className="text-white">Transformik AI</SheetTitle>
                  </SheetHeader>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-4"
                  >
                    {links.map((link) => (
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
