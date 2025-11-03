import api from "@/utils/api";

export const xeroService = {
  sync: async () => {
    try {
      const response = await api.get("/api/xero/auth");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to sync with Xero"
      );
    }
  },

  handleCallback: async (code, state) => {
    try {
      const response = await api.post("/api/xero/callback", {
        code,
        state,
      });
      console.log("Xero callback response:", response.data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to connect to Xero"
      );
    }
  },

  getSyncStatus: async () => {
    try {
      const response = await api.get("/api/xero/sync/status");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get sync status"
      );
    }
  },

  getConnectionStatus: async () => {
    try {
      const response = await api.get("/api/xero/connection");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get connection status"
      );
    }
  },

  fetchInvoices: async ({
    page = 1,
    pageSize = 10,
    type,
    status,
    searchTerm,
  } = {}) => {
    try {
      const whereConditions = [];

      if (type) {
        whereConditions.push(`Type=="${type}"`);
      }

      if (status) {
        whereConditions.push(`Status=="${status}"`);
      }

      const params = {
        page,
        pageSize,
        searchTerm,
      };

      if (whereConditions.length > 0) {
        params.where = whereConditions.join(" AND ");
      }

      const response = await api.get("/api/xero/invoices", { params });
      console.log("Xero invoices response:", response.data);
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          pageSize: 10,
          pageCount: 0,
          itemCount: 0,
        },
        success: response.data.success,
        message: response.data.message,
      };
    } catch (err) {
      console.error("Error fetching invoices:", err);
      throw err;
    }
  },

  fetchAvailableInvoices: async ({
    type,
    status,
    searchTerm,
    isAmountDueNull = false,
  } = {}) => {
    try {
      const whereConditions = [];

      if (type) {
        whereConditions.push(`Type=="${type}"`);
      }

      if (status) {
        whereConditions.push(`Status=="${status}"`);
      }

      if (!isAmountDueNull) {
        whereConditions.push(`AmountDue!=0`);
      }

      const params = {
        searchTerm,
      };

      if (whereConditions.length > 0) {
        params.where = whereConditions.join(" AND ");
      }

      const response = await api.get("/api/xero/invoices/available", {
        params,
      });
      console.log("Xero available invoices response:", response.data);
      return {
        data: response.data.data || [],
        itemCount: response.data.totalCount || 0,
        success: response.data.success,
        message: response.data.message,
      };
    } catch (err) {
      console.error("Error fetching invoices:", err);
      throw err;
    }
  },

  fetchContacts: async ({
    page = 1,
    pageSize = 10,
    where,
    searchTerm,
  } = {}) => {
    try {
      const params = {
        page,
        pageSize,
        where,
        searchTerm,
      };

      const response = await api.get("/api/xero/contacts", { params });
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          pageSize: 10,
          pageCount: 0,
          itemCount: 0,
        },
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch contacts"
      );
    }
  },

  fetchAccounts: async ({ where, order } = {}) => {
    try {
      const response = await api.get("/api/xero/accounts", {
        params: { where, order },
      });
      console.log("Xero accounts response:", response.data);
      return {
        data: response.data.data || [],
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch accounts"
      );
    }
  },

  fetchTaxRates: async ({ where, order } = {}) => {
    try {
      const response = await api.get("/api/xero/tax-rates", {
        params: { where, order },
      });
      return {
        data: response.data.data || [],
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch tax rates"
      );
    }
  },
};
