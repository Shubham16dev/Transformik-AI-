"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  name: string;
  slug: string;
  one_line_description: string;
  price: string;
  url: string;
  category: string | null;
}

const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "Free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "freetrial", label: "Free Trial" },
  { value: "paid", label: "Paid" },
];

export default function AllToolsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryParam || "all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Fetch tools and categories
  useEffect(() => {
    async function fetchTools() {
      const { data, error } = (await supabase
        .from("tools")
        .select("id,name,slug,one_line_description,price,url,logo,category")
        .order("name", { ascending: true })) as {
        data: Tool[] | null;
        error: any | null;
      };

      if (error) {
        console.error("Supabase Fetch Error:", error);
        return;
      }

      const fetchedTools = data || [];
      setTools(fetchedTools);

      const uniqueCategories = Array.from(
        new Set(fetchedTools.map((t) => t.category).filter(Boolean) as string[])
      ).sort((a, b) => a.localeCompare(b));
      setCategories(uniqueCategories);

      // Handle category param
      if (categoryParam) {
        const formattedCategory = categoryParam
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        if (uniqueCategories.some((cat) => cat.toLowerCase() === formattedCategory.toLowerCase())) {
          setCategory(formattedCategory);
        }
      }

      setFilteredTools(fetchedTools);
    }

    fetchTools();
  }, [categoryParam]);

  // Filter tools based on search, category, price
  useEffect(() => {
    let filtered: Tool[] = tools;

    if (search) {
      filtered = filtered.filter((tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(
        (tool) =>
          tool.category &&
          tool.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter(
        (tool) => tool.price.toLowerCase() === priceFilter.toLowerCase()
      );
    }

    setFilteredTools(filtered);
    setCurrentPage(1);
  }, [search, category, priceFilter, tools]);

  // Pagination
  const totalPages = Math.ceil(filteredTools.length / pageSize);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Combobox component
  const Combobox = ({
    value,
    options,
    onChange,
    placeholder,
  }: {
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
    placeholder: string;
  }) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [contentWidth, setContentWidth] = useState<number | undefined>();

    useEffect(() => {
      if (buttonRef.current) {
        setContentWidth(buttonRef.current.offsetWidth);
      }
    }, [buttonRef.current?.offsetWidth]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full md:w-1/3 justify-between border border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-1 focus:ring-purple-600"
          >
            {value
              ? options.find((o) => o.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: contentWidth }} className="p-0">
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} 
            className="focus:ring-0 focus:outline-none"/>
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "all" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.value
                          ? "opacity-100 text-purple-600"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All AI Tools</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2"
        />

        {/* Category Combobox */}
        <Combobox
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((cat) => ({ value: cat, label: cat })),
          ]}
          placeholder="Select Category"
        />

        {/* Price Combobox */}
        <Combobox
          value={priceFilter}
          onChange={setPriceFilter}
          options={PRICE_OPTIONS}
          placeholder="Select Price"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedTools.length > 0 ? (
          paginatedTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={{
                name: tool.name,
                slug: tool.slug,
                description: tool.one_line_description,
                price: tool.price,
                url: tool.url,
                category: tool.category || "Uncategorized",
              }}
            />
          ))
        ) : (
          <p className="text-gray-500">No tools found matching your filters.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        totalItems={filteredTools.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
