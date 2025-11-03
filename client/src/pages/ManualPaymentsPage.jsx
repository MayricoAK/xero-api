import { useEffect, useState } from "react";
import { CreatePaymentForm } from "@/components/manual-payment/CreatePaymentForm";
import { useManualPayments } from "@/hooks/useManualPayments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SyncRequired } from "@/components/xero/SyncRequired";
import { useXeroContext } from "@/context/xeroUtils";
import { PaginatedTable } from "@/components/table/PaginatedTable";
import { ManualPaymentColumns } from "@/utils/columnData";

export function ManualPaymentsPage() {
  const {
    payments,
    loading,
    totalPages,
    totalItem,
    fetchPayments,
    createPayment,
    refreshPayments,
  } = useManualPayments();
  const {
    sync,
    isSyncing,
    isSynced,
    isInitializing,
    forceRefresh,
    error: syncError,
  } = useXeroContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isSynced) {
      fetchPayments({
        page: currentPage,
        size: pageSize,
      });
    }
  }, [currentPage, pageSize, isSynced]);

  const handleRefresh = () => {
    refreshPayments();
  };

  const handleCreatePayment = async (formData) => {
    try {
      const result = await createPayment(formData);

      if (result.success) {
        await refreshPayments();
        return { success: true, data: result.data };
      } else {
        // Handle validation errors
        const errorMessage = result.error || "Failed to create manual payment";

        return { success: false, error: errorMessage, errors: result.errors };
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manual Payments</h2>
          <p className="text-muted-foreground">
            Create and manage manual payments
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || !isSynced}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          <span>Refresh</span>
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {isSynced ? (
              <CreatePaymentForm
                onSubmit={handleCreatePayment}
                loading={loading}
              />
            ) : (
              <SyncRequired
                onSync={sync}
                isSyncing={isSyncing}
                error={syncError}
                onRetry={forceRefresh}
                isInitializing={isInitializing}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Payment List
              {totalItem > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({totalItem} total)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSynced ? (
              <PaginatedTable
                data={payments}
                columns={ManualPaymentColumns}
                pagination={{
                  page: currentPage,
                  pageSize: pageSize,
                  pageCount: totalPages,
                  itemCount: totalItem,
                }}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                loading={loading}
                emptyMessage="No payments available"
                rowIdKey="id"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Please sync with Xero to view payments
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
