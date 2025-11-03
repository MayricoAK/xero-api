import { useState, useCallback } from "react";
import { paymentBatchService } from "@/services/paymentBatchService";
import toast from "react-hot-toast";

export function usePaymentBatch() {
  const [batches, setBatches] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatches = useCallback(
    async ({ page, size, filters = {} } = {}) => {
      const actualPage = page ?? currentPage;
      const actualSize = size ?? pageSize;

      setLoading(true);
      setError(null);
      try {
        const response = await paymentBatchService.get(
          actualPage,
          actualSize,
          filters
        );
        const formattedBatches = response.data.map((batch) => ({
          ...batch,
          id: batch.xoBatchId,
          paymentDate: new Date(batch.paymentDate).toLocaleDateString("en-US"),
        }));
        setBatches(formattedBatches || []);
        setTotalItem(response.totalItem || 0);
        setTotalPages(response.pagination?.totalPages || 0);

        // Update page state if provideds
        if (page !== undefined) setCurrentPage(page);
        if (size !== undefined) setPageSize(size);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  const createBatch = useCallback(
    async (data) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await paymentBatchService.create(data);
        await fetchBatches({});
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchBatches]
  );

  const getBatchById = useCallback(async (batchId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentBatchService.getById(batchId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveBatch = useCallback(async (batchId, approvalData = {}) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await paymentBatchService.approve(batchId, approvalData);
      setBatches((prevBatches) =>
        prevBatches.map((batch) =>
          batch.id === batchId
            ? {
                ...batch,
                isApproved: true,
                lastApprDate: new Date().toLocaleDateString("en-US"),
              }
            : batch
        )
      );
      toast.success("Payment batch approved successfully!");
      return result;
    } catch (err) {
      toast.error(
        err.message || "Failed to approve payment batch. Please try again."
      );
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteBatch = useCallback(
    async (batchId, reason = "") => {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await paymentBatchService.delete(batchId, reason);
        setBatches((prevBatches) =>
          prevBatches.filter((batch) => batch.id !== batchId)
        );
        setTotalItem((prevTotal) => prevTotal - 1);

        const remainingBatches = batches.filter(
          (batch) => batch.id !== batchId
        );
        if (remainingBatches.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
          await fetchBatches({
            page: currentPage - 1,
          });
        }

        toast.success("Payment batch deleted successfully!");
        return result;
      } catch (err) {
        toast.error(
          err.message || "Failed to delete payment batch. Please try again."
        );
        setError(err.message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [batches, currentPage, fetchBatches]
  );

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        fetchBatches({ page });
      }
    },
    [currentPage, totalPages, fetchBatches]
  );

  const changePageSize = useCallback(
    (size) => {
      if (size !== pageSize) {
        fetchBatches({ page: 1, size });
      }
    },
    [pageSize, fetchBatches]
  );

  return {
    // Data
    batches,
    totalItem,
    totalPages,
    currentPage,
    pageSize,

    // States
    loading,
    isSubmitting,
    error,

    // Actions
    fetchBatches,
    createBatch,
    getBatchById,
    approveBatch,
    deleteBatch,

    // Pagination helpers
    goToPage,
    changePageSize,
    setCurrentPage,
    setPageSize,
  };
}
