import api from "@/utils/api";

export const manualPaymentService = {
  get: async (page, size, sortBy, orderBy) => {
    try {
      const response = await api.get("/api/payments/manual", {
        params: {
          page,
          limit: size,
          sortBy,
          orderBy,
        },
      });
      console.log("Manual payments response:", response.data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch manual payments"
      );
    }
  },

  create: async (body) => {
    try {
      const response = await api.post("/api/payments/manual", body);
      return response.data;
    } catch (error) {
      console.error("Error creating manual payment:", error.response?.data);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.success === false) {
          return {
            success: false,
            error:
              errorData.errors?.[0]?.message ||
              errorData.message ||
              "Failed to create manual payment",
            errors: errorData.errors || [],
          };
        }
      }
      throw new Error(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "Failed to create manual payment"
      );
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/api/payments/manual/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment details"
      );
    }
  },
};
