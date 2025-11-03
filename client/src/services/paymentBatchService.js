import api from "@/utils/api";

export const paymentBatchService = {
  get: async (page, size, filters) => {
    try {
      const response = await api.get("/api/payment-batch", {
        params: {
          page,
          limit: size,
          ...filters,
        },
      });
      console.log("Payment Batch response:", response.data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment batches"
      );
    }
  },

  create: async (body) => {
    try {
      const response = await api.post("/api/payment-batch", body);
      return response.data;
    } catch (error) {
      console.error("Error creating payment batch:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create payment batch"
      );
    }
  },

  getById: async (batchId) => {
    try {
      const response = await api.get(`/api/payment-batch/${batchId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch batch details"
      );
    }
  },

  approve: async (batchId, approvalData = {}) => {
    try {
      const response = await api.post(
        `/api/payment-batch/${batchId}/approve`,
        approvalData
      );
      return response.data;
    } catch (error) {
      console.error("Error approving payment batch:", error);
      throw new Error(
        error.response?.data?.message || "Failed to approve payment batch"
      );
    }
  },

  delete: async (batchId, reason) => {
    try {
      const response = await api.delete(`/api/payment-batch/${batchId}`, {
        data: { reason },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting payment batch:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete payment batch"
      );
    }
  },
};
