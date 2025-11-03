import { useState, useMemo, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { TableData } from "./TableData";

export function ClientPaginatedTable({
  data = [],
  columns = [],
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  loading = false,
  error = null,
  emptyMessage = "No data found.",
  className = "",
  onRetry,
  rowIdKey = "id",
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys = [],
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  showInfo = true,
  ...props
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable || searchKeys.length === 0) {
      return data;
    }

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchable, searchKeys]);

  // Calculate pagination
  const pagination = useMemo(() => {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      page: currentPage,
      pageSize,
      pageCount: totalPages,
      itemCount: totalItems,
      totalItems,
    };
  }, [filteredData.length, pageSize, currentPage]);

  // Get current page data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pageCount) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.pageCount) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const current = pagination.page;
    const total = pagination.pageCount;
    const delta = 2;

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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search bar */}
      {searchable && searchKeys.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 max-w-full sm:max-w-sm md:max-w-md">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full text-sm"
            />
          </div>
          {showInfo && (
            <div className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
              {searchTerm ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="px-1 sm:px-2 py-1 rounded font-semibold">
                    {filteredData.length}
                  </span>
                  <span className="hidden sm:inline">of</span>
                  <span className="sm:hidden">/</span>
                  <span className="px-1 sm:px-2 py-1 rounded font-semibold">
                    {data.length}
                  </span>
                  <span className="hidden sm:inline">items</span>
                  {filteredData.length !== data.length && (
                    <span className="hidden md:inline"> (filtered)</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="px-1 sm:px-2 py-1 rounded font-semibold">
                    {data.length}
                  </span>
                  <span>items</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <TableData
        data={paginatedData}
        columns={columns}
        selectable={selectable}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        loading={loading}
        error={error}
        emptyMessage={
          searchTerm && filteredData.length === 0
            ? `No results found for "${searchTerm}"`
            : emptyMessage
        }
        onRetry={onRetry}
        rowIdKey={rowIdKey}
        {...props}
      />

      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row md:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 py-3 border-t bg-white border-gray-200">
          {/* Left side - Results info */}
          {showInfo && (
            <div className="text-xs sm:text-sm font-medium text-gray-600 order-3 sm:order-1">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="hidden md:inline">Showing</span>
                <span className="md:hidden">Results:</span>
                <span className="px-1 sm:px-2 py-1 rounded font-semibold text-xs sm:text-sm">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>
                <span className="hidden md:inline">to</span>
                <span className="md:hidden">-</span>
                <span className="px-1 sm:px-2 py-1 rounded font-semibold text-xs sm:text-sm">
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.itemCount
                  )}
                </span>
                <span className="hidden md:inline">of</span>
                <span className="md:hidden">/</span>
                <span className="px-1 sm:px-2 py-1 rounded font-semibold text-xs sm:text-sm">
                  {pagination.itemCount}
                </span>
                <span className="hidden md:inline">results</span>
                {searchTerm && data.length !== filteredData.length && (
                  <span className="text-gray-500 text-xs">
                    (filtered from {data.length})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Center - Pagination controls */}
          {pagination.pageCount > 1 && (
            <div className="flex items-center justify-center order-1 sm:order-2">
              <Pagination className="mx-0">
                <PaginationContent className="gap-0.5 sm:gap-1 md:gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePreviousPage}
                      disabled={pagination.page <= 1}
                      className={`h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3 cursor-pointer ${
                        pagination.page <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 border-gray-300"
                      }`}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === "..." ? (
                        <PaginationEllipsis className="h-7 sm:h-8 text-gray-600 cursor-default px-1 sm:px-2" />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pageNum === pagination.page}
                          className={`h-7 sm:h-8 w-7 sm:w-8 text-xs sm:text-sm cursor-pointer ${
                            pageNum === pagination.page
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "hover:bg-gray-100 border-gray-300"
                          }`}
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNextPage}
                      disabled={pagination.page >= pagination.pageCount}
                      className={`h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3 cursor-pointer ${
                        pagination.page >= pagination.pageCount
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 border-gray-300"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Right side - Page size selector */}
          <div className="flex items-center gap-1 sm:gap-2 order-2 sm:order-3">
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap text-gray-600">
              <span className="md:hidden">Rows:</span>
              <span className="hidden md:inline">Rows per page:</span>
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[60px] sm:w-[70px] md:w-[80px] h-7 sm:h-8 text-xs sm:text-sm hover:bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[60px] sm:min-w-[70px] md:min-w-[80px]">
                {pageSizeOptions.map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                    className="text-xs sm:text-sm font-medium"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

ClientPaginatedTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      header: PropTypes.node,
      width: PropTypes.string,
      headerClassName: PropTypes.string,
      className: PropTypes.string,
      render: PropTypes.func,
    })
  ),
  selectable: PropTypes.bool,
  selectedIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onSelectionChange: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
  onRetry: PropTypes.func,
  rowIdKey: PropTypes.string,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  initialPageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showInfo: PropTypes.bool,
};
