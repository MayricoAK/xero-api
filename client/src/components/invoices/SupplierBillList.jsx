import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceColumns } from "@/utils/columnData";
import { useXero } from "@/hooks/useXero";
import { useXeroContext } from "@/context/xeroUtils";
import { SyncRequired } from "../xero/SyncRequired";
import { PaginatedTable } from "../table/PaginatedTable";

export function SupplierBillList() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { isLoading, error, invoices, pagination, fetchInvoices } = useXero();
  const { sync, isSyncing, isSynced } = useXeroContext();

  const loadInvoices = useCallback(
    async (page = currentPage, size = pageSize) => {
      try {
        const filters = {
          type: "ACCPAY",
          page,
          pageSize: size,
        };

        if (filterStatus !== "all") {
          filters.status = filterStatus;
        }

        await fetchInvoices(filters);
      } catch (err) {
        console.error("Failed to fetch bills in component:", err);
      }
    },
    [currentPage, pageSize, filterStatus]
  );

  useEffect(() => {
    loadInvoices(1);
  }, [filterStatus, pageSize]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadInvoices(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    loadInvoices(1, newPageSize);
  };

  const handleViewInvoice = (invoice) => {
    navigate(`/invoices/${invoice.invoiceID}`);
  };

  const handleSelectionChange = (selectedItems, selectedMap) => {
    console.log("Selected bills:", selectedItems);
    console.log("Selection map:", selectedMap);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold">Bills</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="AUTHORISED">Authorised</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                  <SelectItem value="VOIDED">Voided</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isSynced ? (
          <PaginatedTable
            data={invoices}
            columns={InvoiceColumns}
            pagination={pagination.invoices}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            selectable={true}
            rowIdKey="invoiceID"
            onRowClick={handleViewInvoice}
            onSelectionChange={handleSelectionChange}
            loading={isLoading}
            error={error}
            emptyMessage="No bills found."
            onRetry={() => loadInvoices(currentPage)}
          />
        ) : (
          <SyncRequired onSync={sync} isSyncing={isSyncing} />
        )}
      </CardContent>
    </Card>
  );
}
