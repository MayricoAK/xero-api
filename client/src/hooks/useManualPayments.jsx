import { useState } from "react";
import { manualPaymentService } from "@/services/manualPaymentService";

export const useManualPayments = () => {
  const [payments, setPayments] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = async ({
    page = 1,
    size = 10,
    sortBy = "payment_date",
    orderBy = "DESC",
  }) => {
    try {
      setLoading(true);
      const response = await manualPaymentService.get(
        page,
        size,
        sortBy,
        orderBy
      );
      setPayments(response.data || []);
      setTotalItem(response.totalItem || 0);
      setTotalPages(response.pagination?.totalPages || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await manualPaymentService.create(paymentData);
      console.log("Payment creation response hook:", response);

      // Check if the response indicates failure
      if (response.success === false) {
        setError(response.error);
        return {
          success: false,
          error: response.error,
          errors: response.errors || [],
        };
      }

      // Success case
      setError(null);
      return {
        success: true,
        data: response.data || response,
      };
    } catch (err) {
      console.error("Error creating payment hook:", err);
      setError(err.message);
      return {
        success: false,
        error: err.message,
        errors: [{ message: err.message }],
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    totalItem,
    totalPages,
    createPayment,
    fetchPayments,
    refreshPayments: fetchPayments,
  };
};
