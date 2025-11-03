import { useState, useEffect, useRef } from "react";
import { usePaymentBatch } from "@/hooks/usePaymentBatch";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import Filters from "@/components/approval/Filters";
import PaymentList from "@/components/approval/PaymentList";

const ApprovalPage = () => {
  const {
    batches,
    totalItem,
    totalPages,
    currentPage,
    pageSize,
    loading,
    isSubmitting,
    fetchBatches,
    approveBatch,
    deleteBatch,
    goToPage,
    changePageSize,
  } = usePaymentBatch();

  const [filters, setFilters] = useState({
    search: "",
    isApproved: "all",
  });

  const [approveModal, setApproveModal] = useState({
    isOpen: false,
    batch: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    batch: null,
  });

  const initialFetchDone = useRef(false);
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    const processedFilters = {
      ...filters,
      isApproved:
        filters.isApproved === "all"
          ? undefined
          : filters.isApproved === "true",
    };

    // Check if filters actually changed
    const filtersChanged =
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

    if (!initialFetchDone.current) {
      // Initial fetch
      fetchBatches({ filters: processedFilters });
      initialFetchDone.current = true;
      prevFiltersRef.current = filters;
    } else if (filtersChanged) {
      fetchBatches({ page: 1, filters: processedFilters });
      prevFiltersRef.current = filters;
    }
  }, [filters, fetchBatches]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({ search: "", isApproved: "all" });
  };

  // Handle approve action
  const handleApprove = (batch) => {
    setApproveModal({
      isOpen: true,
      batch,
    });
  };

  // Handle delete action
  const handleDelete = (batch) => {
    setDeleteModal({
      isOpen: true,
      batch,
    });
  };

  // Confirm approve
  const confirmApprove = async () => {
    try {
      await approveBatch(approveModal.batch.id);
      setApproveModal({ isOpen: false, batch: null });
    } catch (error) {
      console.error("Failed to approve batch:", error);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteBatch(deleteModal.batch.id);
      setDeleteModal({ isOpen: false, batch: null });
    } catch (error) {
      console.error("Failed to delete batch:", error);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    goToPage(page);
  };

  const handlePageSizeChange = (size) => {
    changePageSize(size);
  };

  return (
    <div className="max-w-screen mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-primary break-words">
              Payment Batch Approval
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Manage and approve payment batches for processing
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Filters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      {/* Payment List */}
      <PaymentList
        batches={batches}
        totalItem={totalItem}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        loading={loading}
        isSubmitting={isSubmitting}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onApprove={handleApprove}
        onDelete={handleDelete}
      />

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, batch: null })}
        onConfirm={confirmApprove}
        title="Approve Payment Batch"
        message={`Are you sure you want to approve payment batch ${approveModal.batch?.batchIdNumber}?`}
        confirmText="Approve"
        cancelText="Cancel"
        variant="success"
        isLoading={isSubmitting}
        loadingText="Approving..."
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, batch: null })}
        onConfirm={confirmDelete}
        title="Delete Payment Batch"
        message={`Are you sure you want to delete payment batch ${deleteModal.batch?.batchIdNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default ApprovalPage;
