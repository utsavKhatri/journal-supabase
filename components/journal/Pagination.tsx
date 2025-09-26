"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  totalItems: number | null;
  itemsPerPage?: number;
}

export function Pagination({
  totalPages,
  currentPage = 1,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      router.push(createPageURL(page));
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Show pages 2-5 and ellipsis
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("ellipsis");
        }
      } else if (currentPage >= totalPages - 3) {
        // Show ellipsis and last 4 pages
        pages.push("ellipsis");
        for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page area, ellipsis
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      }

      // Always show last page (if it's not already included)
      if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <div
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              className={cn(
                "h-9 w-9 p-0",
                currentPage === page && "bg-primary text-primary-foreground"
              )}
            >
              {page}
            </Button>
          )
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Optional: Page info */}
      {totalItems && itemsPerPage && (
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
}
