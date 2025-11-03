import { useState, useCallback } from "react";
import { xeroService } from "@/services/xeroService";

export const useXero = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    invoices: [],
    availableInvoices: [],
    contacts: [],
    accounts: [],
    taxRates: [],
  });
  const [pagination, setPagination] = useState({
    invoices: {
      page: 1,
      pageSize: 10,
      pageCount: 0,
      itemCount: 0,
    },
    contacts: {
      page: 1,
      pageSize: 10,
      pageCount: 0,
      itemCount: 0,
    },
  });

  const formatInvoices = (rawInvoices) => {
    return rawInvoices.map((invoice) => ({
      ...invoice,
      id: invoice.invoiceID,
      contactName: invoice.contact?.name || "No Name",
      contactID: invoice.contact?.contactID || "",
      isManualPayment: false,
    }));
  };

  const formatAccounts = (rawAccounts) => {
    return rawAccounts.map((account) => ({
      ...account,
      id: account.accountID,
      displayName: `${account.name} - ${
        account.bankAccountNumber ? account.bankAccountNumber.slice(-4) : ""
      }`,
      isBankAccount: account.type === "BANK",
    }));
  };

  const fetchInvoices = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await xeroService.fetchInvoices(filters);

      setData((prev) => ({
        ...prev,
        invoices: formatInvoices(response.data),
      }));
      setPagination((prev) => ({ ...prev, invoices: response.pagination }));
      return response;
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch invoices";
      setError(errorMessage);
      console.error("Error in useXero hook:", err);
      return { data: [], pagination: pagination.invoices };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableInvoices = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await xeroService.fetchAvailableInvoices(filters);

      setData((prev) => ({
        ...prev,
        availableInvoices: formatInvoices(response.data),
      }));
      return response;
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch invoices";
      setError(errorMessage);
      console.error("Error in useXero hook:", err);
      return { data: [], pagination: pagination.invoices };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await xeroService.fetchContacts(filters);
      setData((prev) => ({ ...prev, contacts: response.data }));
      setPagination((prev) => ({ ...prev, contacts: response.pagination }));
      return response;
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch contacts";
      setError(errorMessage);
      console.error("Error in useXero hook:", err);
      return { data: [], pagination: pagination.contacts };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await xeroService.fetchAccounts(filters);
      console.log("Xero accounts hook:", response);
      const formattedAccounts = formatAccounts(response.data);

      setData((prev) => ({ ...prev, accounts: formattedAccounts }));

      return {
        ...response,
        data: formattedAccounts,
      };
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch accounts";
      setError(errorMessage);
      console.error("Error in useXero hook:", err);
      return { data: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTaxRates = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await xeroService.fetchTaxRates(filters);
      setData((prev) => ({ ...prev, taxRates: response.data }));
      return response;
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch tax rates";
      setError(errorMessage);
      console.error("Error in useXero hook:", err);
      return { data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...data,
    pagination,
    isLoading,
    error,

    fetchInvoices,
    fetchAvailableInvoices,
    fetchContacts,
    fetchAccounts,
    fetchTaxRates,
  };
};
