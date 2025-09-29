"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, SlashIcon } from "lucide-react";

export default function BreadcrumbsClient() {
  const pathname = usePathname();
  const pathParts = pathname?.split("/").filter(Boolean) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home */}
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathParts.map((part, index) => {
            const href = "/" + pathParts.slice(0, index + 1).join("/");
            const isLast = index === pathParts.length - 1;
            const label = part
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <BreadcrumbItem key={href}>
                {!isLast ? (
                  <>
                    <BreadcrumbSeparator>
                      <SlashIcon className="w-2 h-4 text-gray-400" />
                    </BreadcrumbSeparator>
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  </>
                ) : (
                  <>
                    <BreadcrumbSeparator>
                      <SlashIcon className="w-2 h-4 text-gray-400" />
                    </BreadcrumbSeparator>
                    <span className="text-gray-500 font-medium">{label}</span>
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
