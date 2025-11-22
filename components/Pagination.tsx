"use client";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  basePath?: string;
}

export function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  basePath,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null; // no pagination needed

  // Windowed pagination logic: show up to 10 page numbers
  let startPage = 1;
  let endPage = totalPages;
  if (totalPages > 10) {
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  // Build hrefs so page 1 is the clean URL (no ?page=1).
  // Use provided basePath (required to avoid hydration errors)
  const effectiveBasePath = basePath ?? "/";
  const makeHref = (page: number) =>
    page === 1 ? effectiveBasePath : `${effectiveBasePath}?page=${page}`;

  return (
    <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
      <a
        href={makeHref(Math.max(currentPage - 1, 1))}
        className={`px-4 py-2 border rounded ${
          currentPage === 1
            ? "cursor-not-allowed opacity-50 bg-gray-400 text-white"
            : "bg-black text-white hover:bg-gray-700"
        }`}
        onClick={(e) => {
          e.preventDefault();
          onPageChange(Math.max(currentPage - 1, 1));
        }}
      >
        Previous
      </a>

      {pageNumbers.map((page) => (
        <a
          key={page}
          href={makeHref(page)}
          className={`px-4 py-2 border rounded ${
            page === currentPage
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(page);
          }}
        >
          {page}
        </a>
      ))}
      {endPage < totalPages && <span className="px-2 text-black">...</span>}

      <a
        href={makeHref(Math.min(currentPage + 1, totalPages))}
        className={`px-4 py-2 border rounded ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50 bg-gray-400 text-white"
            : "bg-black text-white hover:bg-gray-700"
        }`}
        onClick={(e) => {
          e.preventDefault();
          onPageChange(Math.min(currentPage + 1, totalPages));
        }}
      >
        Next
      </a>
    </div>
  );
}
