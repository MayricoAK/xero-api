import PropTypes from "prop-types";
import { RequestApprovalColumns } from "@/utils/columnData";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClientPaginatedTable } from "../table/ClientPaginatedTable";

export const AvailableInvoices = ({
  availableInvoices = [],
  selectedIds = [],
  onInvoiceSelect,
  isLoading = false,
  error = null,
}) => {
  const handleSelectionChange = (newSelectedIds) => {
    onInvoiceSelect(newSelectedIds);
  };

  const handleSelectAll = () => {
    const allIds = availableInvoices.map((inv) => inv.id);
    const newSelectedIds = [...new Set([...selectedIds, ...allIds])];
    onInvoiceSelect(newSelectedIds);
  };

  const handleClearAll = () => {
    onInvoiceSelect([]);
  };

  const allSelected =
    availableInvoices.length > 0 &&
    availableInvoices.every((inv) => selectedIds.includes(inv.id));
  const someSelected = availableInvoices.some((inv) =>
    selectedIds.includes(inv.id)
  );

  const customActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSelectAll}
        disabled={allSelected || isLoading}
      >
        Select All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClearAll}
        disabled={!someSelected || isLoading}
      >
        Clear All
      </Button>
    </>
  );

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Available Invoices</CardTitle>
        <div className="flex space-x-2">{customActions}</div>
      </CardHeader>
      <CardContent>
        <ClientPaginatedTable
          data={availableInvoices}
          columns={RequestApprovalColumns}
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
          loading={isLoading}
          error={error}
          emptyMessage="No invoices available"
          rowIdKey="id"
          searchable={false}
          searchKeys={["invoiceNumber", "contactName", "reference", "total"]}
          searchPlaceholder="Search invoices..."
          initialPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </CardContent>
    </Card>
  );
};

// Props validation
AvailableInvoices.propTypes = {
  availableInvoices: PropTypes.arrayOf(PropTypes.object),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  onInvoiceSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
