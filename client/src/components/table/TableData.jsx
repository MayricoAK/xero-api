import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

export function TableData({
  data = [],
  columns = [],
  selectable = false,
  onRowClick,
  selectedIds: externalSelectedIds = null,
  onSelectionChange,
  loading = false,
  error = null,
  emptyMessage = "No data found.",
  className = "",
  onRetry,
  rowIdKey = "id",
  theme = "default",
  striped = true,
  hover = true,
  minWidth = "600px",
  maxWidth = "100%",
}) {
  const [internalSelectedIds, setInternalSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const selectedIds =
    externalSelectedIds !== null ? externalSelectedIds : internalSelectedIds;

  useEffect(() => {
    const allSelected =
      data.length > 0 &&
      data.every((row) => selectedIds.includes(getRowId(row)));
    setSelectAll(allSelected);
  }, [data, selectedIds]);

  const getRowId = (row) => {
    return row[rowIdKey] || row.id;
  };

  const handleSelectionChange = (newSelectedIds) => {
    if (externalSelectedIds !== null) {
      onSelectionChange?.(newSelectedIds);
    } else {
      setInternalSelectedIds(newSelectedIds);
      onSelectionChange?.(newSelectedIds);
    }
  };

  const toggleSelectRow = (e, rowId) => {
    e.stopPropagation();
    const newSelectedIds = selectedIds.includes(rowId)
      ? selectedIds.filter((id) => id !== rowId)
      : [...selectedIds, rowId];
    handleSelectionChange(newSelectedIds);
  };

  const toggleSelectAll = (checked) => {
    const currentPageIds = data.map((row) => getRowId(row));
    const newSelectedIds = checked
      ? [...new Set([...selectedIds, ...currentPageIds])]
      : selectedIds.filter((id) => !currentPageIds.includes(id));
    handleSelectionChange(newSelectedIds);
    setSelectAll(checked);
  };

  // Theme configurations
  const themes = {
    default: {
      header: "bg-gray-50 text-gray-900 border-b border-gray-200",
      row: "border-b border-gray-100",
      rowHover: "hover:bg-gray-50",
      rowSelected: "bg-blue-50 border-blue-200",
      rowStripe: "bg-gray-25",
    },
    dark: {
      header: "bg-gray-800 text-gray-100 border-b border-gray-700",
      row: "border-b border-gray-700",
      rowHover: "hover:bg-gray-700",
      rowSelected: "bg-gray-700 border-gray-600",
      rowStripe: "bg-gray-800",
    },
    blue: {
      header: "bg-blue-600 text-white border-b border-blue-700",
      row: "border-b border-blue-100",
      rowHover: "hover:bg-blue-50",
      rowSelected: "bg-blue-100 border-blue-300",
      rowStripe: "bg-blue-25",
    },
    green: {
      header: "bg-green-600 text-white border-b border-green-700",
      row: "border-b border-green-100",
      rowHover: "hover:bg-green-50",
      rowSelected: "bg-green-100 border-green-300",
      rowStripe: "bg-green-25",
    },
    purple: {
      header: "bg-purple-600 text-white border-b border-purple-700",
      row: "border-b border-purple-100",
      rowHover: "hover:bg-purple-50",
      rowSelected: "bg-purple-100 border-purple-300",
      rowStripe: "bg-purple-25",
    },
  };

  const currentTheme = themes[theme] || themes.default;

  const getRowClassName = (row, rowIndex) => {
    const baseClasses = [currentTheme.row];
    const rowId = getRowId(row);

    // Add hover effect
    if (hover && onRowClick) {
      baseClasses.push("cursor-pointer", currentTheme.rowHover);
    }

    // Add selected state
    if (selectedIds.includes(rowId)) {
      baseClasses.push(currentTheme.rowSelected);
    }

    // Add striped effect
    if (striped && rowIndex % 2 === 1 && !selectedIds.includes(rowId)) {
      baseClasses.push(currentTheme.rowStripe);
    }

    // Add transition for smooth effects
    baseClasses.push("transition-colors duration-150");

    return baseClasses.join(" ");
  };

  const renderLoadingSkeleton = (index) => (
    <TableRow key={`skeleton-${index}`} className={currentTheme.row}>
      {Array(columns.length + (selectable ? 1 : 0))
        .fill(0)
        .map((_, cellIndex) => (
          <TableCell key={cellIndex} className="py-3">
            <Skeleton className="h-4 w-full bg-gray-200 animate-pulse" />
          </TableCell>
        ))}
    </TableRow>
  );

  if (error) {
    return (
      <Alert variant="destructive" className="m-4 border-red-200 bg-red-50">
        <AlertDescription className="flex items-center justify-between">
          <span className="text-red-800">{error}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={`${className} rounded-lg border border-gray-200 overflow-hidden shadow-sm`}
    >
      <div className="relative overflow-x-auto">
        <Table
          style={{
            minWidth: minWidth,
            maxWidth: maxWidth,
          }}
        >
          <TableHeader>
            <TableRow className={currentTheme.header}>
              {selectable && (
                <TableHead className="w-12 font-semibold">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={toggleSelectAll}
                    disabled={loading}
                    className="border-current"
                  />
                </TableHead>
              )}
              {columns.map((column, index) => (
                <TableHead
                  key={column.key || index}
                  className={`font-semibold text-sm ${column.width || ""} ${
                    column.headerClassName || ""
                  }`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, index) => renderLoadingSkeleton(index))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-32 text-center text-gray-500 py-8"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl text-gray-300">📋</div>
                    <div className="text-sm font-medium">{emptyMessage}</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={getRowId(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={getRowClassName(row, rowIndex)}
                >
                  {selectable && (
                    <TableCell className="w-12 py-3">
                      <Checkbox
                        checked={selectedIds.includes(getRowId(row))}
                        onCheckedChange={() =>
                          toggleSelectRow(
                            { stopPropagation: () => {} },
                            getRowId(row)
                          )
                        }
                      />
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      className={`py-3 text-sm ${column.className || ""}`}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Selection indicator */}
      {selectable && selectedIds.length > 0 && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedIds.length} item{selectedIds.length === 1 ? "" : "s"}{" "}
              selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectionChange([])}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              Clear selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

TableData.propTypes = {
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
  onRowClick: PropTypes.func,
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
  theme: PropTypes.oneOf(["default", "dark", "blue", "green", "purple"]),
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  minWidth: PropTypes.string,
  maxWidth: PropTypes.string,
};
