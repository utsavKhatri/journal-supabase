"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
}

/**
 * The Pagination component provides a set of controls for navigating through paginated content.
 * It displays page numbers, previous/next buttons, and uses ellipses for large page ranges
 * to maintain a clean and user-friendly interface.
 */
export function Pagination({ totalPages, currentPage = 1 }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Creates a URL for a specific page number by updating the 'page' search parameter.
   */
  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  /**
   * Navigates to the specified page number if it is within the valid range.
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      router.push(createPageURL(page));
    }
  };

  /**
   * Generates the list of page numbers to display in the pagination control.
   * For a small number of pages, it shows all page numbers.
   * For a larger number, it uses ellipses to shorten the list, keeping the current page
   * and its immediate neighbors visible.
   */
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if there are 7 or fewer.
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page.
      pages.push(1);

      if (currentPage <= 4) {
        // Show pages 2-5 and an ellipsis if near the beginning.
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("ellipsis");
        }
      } else if (currentPage >= totalPages - 3) {
        // Show an ellipsis and the last 4 pages if near the end.
        pages.push("ellipsis");
        for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // Show an ellipsis, the current page and its neighbors, and another ellipsis for middle pages.
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      }

      // Always show the last page if it's not already included.
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

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
    </div>
  );
}
