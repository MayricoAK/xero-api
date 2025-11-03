import PropTypes from "prop-types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { TableData } from "./TableData";

export function PaginatedTable({
  data = [],
  columns = [],
  pagination,
  onPageChange,
  onPageSizeChange,
  loading = false,
  pageSizeOptions = [10, 25, 50, 100],
  showFirstLast = true,
  showPageInfo = true,
  showPageSizeSelector = true,
  compactMode = false,
  noResultsMessage = "No results found",
  ...props
}) {
  const handlePreviousPage = () => {
    if (pagination?.page > 1 && !loading) {
      onPageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.page < pagination?.pageCount && !loading) {
      onPageChange(pagination.page + 1);
    }
  };

  const handleFirstPage = () => {
    if (pagination?.page > 1 && !loading) {
      onPageChange(1);
    }
  };

  const handleLastPage = () => {
    if (pagination?.page < pagination?.pageCount && !loading) {
      onPageChange(pagination.pageCount);
    }
  };

  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(newSize));
      onPageChange(1);
    }
  };

  const getPageNumbers = () => {
    if (!pagination) return [];

    const current = pagination.page;
    const total = pagination.pageCount;
    const delta = compactMode ? 1 : 2;

    const pages = [];
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  // Default theme styles
  const themeStyles = {
    container: "bg-white border-gray-200",
    text: "text-gray-600",
    accent: "text-gray-900",
    button: "hover:bg-gray-100 border-gray-300",
    active: "bg-blue-600 text-white hover:bg-blue-700",
    disabled: "opacity-50 cursor-not-allowed",
  };

  const PaginationControls = () => (
    <div
      className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-4 py-3 border-t ${themeStyles.container}`}
    >
      {/* Left side - Results info and page size */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {showPageInfo && pagination && (
          <div className={`text-sm font-medium ${themeStyles.text}`}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline">Showing</span>
                <span className="md:hidden">Results:</span>
                <span className="px-2 py-1 rounded font-semibold">
                  {Math.min(
                    (pagination.page - 1) * pagination.pageSize + 1,
                    pagination.itemCount
                  )}
                </span>
                <span className="hidden md:inline">to</span>
                <span className="md:hidden">-</span>
                <span className="px-2 py-1 rounded font-semibold">
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.itemCount
                  )}
                </span>
                <span className="hidden md:inline">of</span>
                <span className="md:hidden">/</span>
                <span className="px-2 py-1 rounded font-semibold">
                  {pagination.itemCount}
                </span>
                <span className="hidden md:inline">results</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center - Pagination */}
      {pagination && pagination.pageCount > 1 && (
        <div className="flex items-center">
          <Pagination className="mx-0">
            <PaginationContent className="gap-1 md:gap-1">
              {/* First page */}
              {showFirstLast && pagination.pageCount > 5 && (
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirstPage}
                    disabled={loading || pagination.page <= 1}
                    className={`h-8 w-8 p-0 cursor-pointer ${
                      loading || pagination.page <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              )}

              {/* Previous page */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  disabled={loading || pagination.page <= 1}
                  className={`h-8 cursor-pointer ${
                    loading || pagination.page <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                />
              </PaginationItem>

              {/* Page numbers */}
              {getPageNumbers().map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum === "..." ? (
                    <PaginationEllipsis className="h-8 text-gray-600 cursor-default" />
                  ) : (
                    <PaginationLink
                      onClick={() => !loading && onPageChange(pageNum)}
                      isActive={pageNum === pagination.page}
                      disabled={loading}
                      className={`h-8 w-8 cursor-pointer ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : pageNum === pagination.page
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next page */}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  disabled={loading || pagination.page >= pagination.pageCount}
                  className={`h-8 cursor-pointer ${
                    loading || pagination.page >= pagination.pageCount
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                />
              </PaginationItem>

              {/* Last page */}
              {showFirstLast && pagination.pageCount > 5 && (
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLastPage}
                    disabled={
                      loading || pagination.page >= pagination.pageCount
                    }
                    className={`h-8 w-8 p-0 cursor-pointer ${
                      loading || pagination.page >= pagination.pageCount
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Right side - Page size selector */}
      <div className="flex items-center gap-4">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium whitespace-nowrap ${themeStyles.text}`}
            >
              <span className="md:hidden">Rows:</span>
              <span className="hidden md:inline">Rows per page:</span>
            </span>
            <Select
              value={String(pagination?.pageSize || 10)}
              onValueChange={handlePageSizeChange}
              disabled={loading}
            >
              <SelectTrigger
                className={`w-[70px] sm:w-[80px] h-8 text-sm ${themeStyles.button} focus:ring-2 focus:ring-blue-500`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[70px] sm:min-w-[80px]">
                {pageSizeOptions.map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                    className="text-sm font-medium"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-0">
      {/* Table */}
      <TableData
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage={noResultsMessage}
        {...props}
      />

      {/* Bottom pagination */}
      <PaginationControls />
    </div>
  );
}

// Props validation
PaginatedTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ),
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    itemCount: PropTypes.number.isRequired,
  }),
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func,
  loading: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showFirstLast: PropTypes.bool,
  showPageInfo: PropTypes.bool,
  showPageSizeSelector: PropTypes.bool,
  compactMode: PropTypes.bool,
  noResultsMessage: PropTypes.string,
};
