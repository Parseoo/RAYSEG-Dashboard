"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled
}: Readonly<PaginationProps>) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Limit shown pages if many
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages
    if (currentPage <= 3) return pages.slice(0, 5)
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5)
    return pages.slice(currentPage - 3, currentPage + 2)
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-slate-100">
      <div className="text-sm text-gray-500">
        Página <span className="font-medium text-gray-900">{currentPage}</span> de <span className="font-medium text-gray-900">{totalPages}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft size={16} />
        </Button>
        
        {visiblePages[0] > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8 p-0"
            >
              1
            </Button>
            {visiblePages[0] > 2 && <span className="px-1 text-gray-400">...</span>}
          </>
        )}

        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className={cn(
              "h-8 w-8 p-0",
              page === currentPage ? "bg-primary_color hover:bg-primary_color/90" : ""
            )}
          >
            {page}
          </Button>
        ))}

        {visiblePages.at(-1)! < totalPages && (
          <>
            {visiblePages.at(-1)! < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="h-8 w-8 p-0"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
