import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, RotateCcw } from "lucide-react";

const Filters = ({ filters, onFiltersChange, onClearFilters, loading }) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters, onFiltersChange]);

  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    setSearchInput("");
    onClearFilters();
  };

  const hasActiveFilters = filters.search || filters.isApproved !== "all";

  const getStatusLabel = (value) => {
    switch (value) {
      case "true":
        return "Approved";
      case "false":
        return "Pending";
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Filter Row */}
      <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-lg border shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <Input
              placeholder="Search batches..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 text-sm sm:text-base h-9 sm:h-10"
              disabled={loading}
            />
          </div>

          {/* Status Filter and Clear Button Row */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
            {/* Status Filter */}
            <div className="w-full xs:w-40 sm:w-44 lg:w-40">
              <Select
                value={filters.isApproved}
                onValueChange={(value) =>
                  handleFilterChange("isApproved", value)
                }
                disabled={loading}
              >
                <SelectTrigger className="text-sm sm:text-base h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Approved</SelectItem>
                  <SelectItem value="false">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={loading}
                className="whitespace-nowrap text-sm px-3 py-2 h-9 sm:h-10 w-full xs:w-auto min-w-[80px] flex-shrink-0"
              >
                <RotateCcw className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="hidden xs:inline">Clear Filters</span>
                <span className="xs:hidden">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">
              Active Filters:
            </span>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs max-w-[180px] sm:max-w-[200px] flex items-center"
                >
                  <span className="truncate min-w-0">
                    Search: {filters.search}
                  </span>
                  <button
                    onClick={() => {
                      setSearchInput("");
                      onFiltersChange({ ...filters, search: "" });
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5 flex-shrink-0 transition-colors"
                    disabled={loading}
                    aria-label="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.isApproved !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs flex items-center flex-shrink-0"
                >
                  <span>Status: {getStatusLabel(filters.isApproved)}</span>
                  <button
                    onClick={() => handleFilterChange("isApproved", "all")}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5 flex-shrink-0 transition-colors"
                    disabled={loading}
                    aria-label="Remove status filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    isApproved: PropTypes.oneOf(["all", "true", "false"]),
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default Filters;
