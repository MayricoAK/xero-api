import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { SyncRequired } from "@/components/xero/SyncRequired";
import { AvailableInvoices } from "@/components/request-approval/AvailableInvoices";
import { ManualPayment } from "@/components/request-approval/ManualPayment";
import { PaymentSummary } from "@/components/request-approval/PaymentSummary";
import { useManualPayments } from "@/hooks/useManualPayments";
import { useXero } from "@/hooks/useXero";
import RecentBatches from "@/components/payment-batch/RecentBatches";
import { useXeroContext } from "@/context/xeroUtils";

const RequestApproval = () => {
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [manualPayments, setManualPayments] = useState([]);
  const [allInvoices, setAllInvoices] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { availableInvoices, fetchAvailableInvoices, isLoading, error } =
    useXero();

  const {
    sync,
    isSyncing,
    isSynced,
    isInitializing,
    forceRefresh,
    error: syncError,
  } = useXeroContext();

  const { createPayment } = useManualPayments();
  const hasFetched = useRef(false);
  const lastSyncState = useRef(isSynced);

  const selectedInvoices = selectedInvoiceIds
    .map((id) => {
      const currentInvoice = availableInvoices.find(
        (invoice) => invoice.id === id
      );
      if (currentInvoice) return currentInvoice;
      return allInvoices[id];
    })
    .filter(Boolean);

  const loadAvailableInvoices = useCallback(async () => {
    try {
      const filters = {
        type: "ACCPAY",
        status: "AUTHORISED",
        isAmountDueNull: false,
      };

      await fetchAvailableInvoices(filters);
    } catch (error) {
      console.error("Failed to fetch available invoices:", error);
      toast.error("Failed to load invoices. Please try again.");
    }
  }, [fetchAvailableInvoices]);

  useEffect(() => {
    if (isSynced && !isInitializing && !hasFetched.current) {
      hasFetched.current = true;
      loadAvailableInvoices();
    }

    if (lastSyncState.current && !isSynced) {
      hasFetched.current = false;
    }

    lastSyncState.current = isSynced;
  }, [isSynced, isInitializing, loadAvailableInvoices]);

  // Auto-refresh connection on mount if there are auth parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has("code") || urlParams.has("state");

    if (hasAuthParams && !isSynced && !isInitializing) {
      setTimeout(() => {
        forceRefresh();
      }, 2000);
    }
  }, [forceRefresh, isSynced, isInitializing]);

  useEffect(() => {
    if (syncError && !isSynced && !isSyncing && !isInitializing) {
      const timer = setTimeout(() => {
        forceRefresh();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [syncError, isSynced, isSyncing, isInitializing, forceRefresh]);

  useEffect(() => {
    if (availableInvoices.length > 0) {
      const invoiceMap = {};
      availableInvoices.forEach((invoice) => {
        invoiceMap[invoice.id] = invoice;
      });
      setAllInvoices((prev) => ({
        ...prev,
        ...invoiceMap,
      }));
    }
  }, [availableInvoices]);

  const handleInvoiceSelectionChange = (newSelectedIds) => {
    setSelectedInvoiceIds(newSelectedIds);
  };

  const handleAddManualPayment = async (formData) => {
    try {
      const result = await createPayment(formData);
      console.log("Payment creation result page:", result);

      // Handle success
      if (result.success) {
        const payment = createPaymentObject(formData, result);
        setManualPayments((prev) => [...prev, payment]);
        return { success: true, data: payment };
      }

      // Handle validation errors
      else {
        const errorMessage = result.error || "Failed to create manual payment";

        // Show individual validation errors
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error) => {
            toast.error(error.message);
          });
        } else {
          toast.error(errorMessage);
        }

        return { success: false, error: errorMessage, errors: result.errors };
      }
    } catch (error) {
      console.error("Failed to add manual payment:", error);
      toast.error(
        error.message || "Failed to create manual payment. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  // Helper function to create payment object
  const createPaymentObject = (formData, result) => {
    const subTotal =
      formData.lines?.reduce((sum, line) => {
        return sum + (parseFloat(line.line_amount) || 0);
      }, 0) || 0;

    const totalTax =
      formData.lines?.reduce((sum, line) => {
        const lineAmount = parseFloat(line.line_amount) || 0;
        const taxRate = parseFloat(line.tax_rate) || 0;
        const taxAmount = lineAmount * taxRate;
        return sum + taxAmount;
      }, 0) || 0;

    const total = subTotal + totalTax;

    return {
      id: result.data?.payment_reference || `manual_${Date.now()}`,
      contactName: formData.contact_name,
      contactID: formData.contact_id,
      status: formData.status || "DRAFTED",
      taxIncl: formData.taxIncl || false,
      subTotal: subTotal,
      totalTax: totalTax,
      total: total,
      lineItems: formData.lines || [],
      invoiceNumber: result.data?.payment_reference || "",
      reference: result.data?.payment_reference || formData.reference || "",
      description: formData.description || "",
      date: formData.payment_date || new Date().toISOString().split("T")[0],
      currency: formData.currency_code || "SGD",
      isManualPayment: true,
      createdAt: new Date().toISOString(),
    };
  };

  const handleRemoveInvoice = (id) => {
    setSelectedInvoiceIds((prev) =>
      prev.filter((selectedId) => selectedId !== id)
    );
  };

  const handleRemoveManualPayment = (id) => {
    setManualPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  const handleClearAllInvoices = () => {
    setSelectedInvoiceIds([]);
  };

  const handleClearAllManualPayments = () => {
    setManualPayments([]);
  };

  const handleBatchSubmitted = () => {
    setSelectedInvoiceIds([]);
    setManualPayments([]);
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      hasFetched.current = false;
      loadAvailableInvoices();
    }, 1000);
  };

  return (
    <div className="mx-auto p-4 md:p-8">
      <div className="px-4 sm:px-6 mb-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Request Approval
          </h1>
        </div>

        {/* Main Content */}
        {isSynced ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AvailableInvoices
                availableInvoices={availableInvoices}
                selectedIds={selectedInvoiceIds}
                onInvoiceSelect={handleInvoiceSelectionChange}
                isLoading={isLoading}
                error={error}
              />
              <ManualPayment onAddPayment={handleAddManualPayment} />

              <div className="lg:hidden space-y-6">
                <PaymentSummary
                  selectedInvoices={selectedInvoices}
                  manualPayments={manualPayments}
                  onBatchSubmitted={handleBatchSubmitted}
                  onRemoveInvoice={handleRemoveInvoice}
                  onRemoveManualPayment={handleRemoveManualPayment}
                  onClearAllInvoices={handleClearAllInvoices}
                  onClearAllManualPayments={handleClearAllManualPayments}
                />
                <RecentBatches refreshTrigger={refreshTrigger} />
              </div>
            </div>

            <div className="hidden lg:block space-y-6">
              <PaymentSummary
                selectedInvoices={selectedInvoices}
                manualPayments={manualPayments}
                onBatchSubmitted={handleBatchSubmitted}
                onRemoveInvoice={handleRemoveInvoice}
                onRemoveManualPayment={handleRemoveManualPayment}
                onClearAllInvoices={handleClearAllInvoices}
                onClearAllManualPayments={handleClearAllManualPayments}
              />
              <RecentBatches refreshTrigger={refreshTrigger} />
            </div>
          </div>
        ) : (
          <SyncRequired
            onSync={sync}
            isSyncing={isSyncing}
            error={syncError}
            onRetry={forceRefresh}
            isInitializing={isInitializing}
          />
        )}
      </div>
    </div>
  );
};

export default RequestApproval;
