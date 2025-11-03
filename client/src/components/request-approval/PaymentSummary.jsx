import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useXero } from "@/hooks/useXero";
import { useXeroContext } from "@/context/xeroUtils";
import { PaymentDetailsModal } from "./PaymentDetailsModal";
import { PaymentSummaryList } from "./PaymentSummaryList";
import { ConfirmationModal } from "../ConfirmationModal";
import { getTodayDateString, truncateBankAccountNumber } from "@/utils";
import { usePaymentBatch } from "@/hooks/usePaymentBatch";
import toast from "react-hot-toast";

export const PaymentSummary = ({
  selectedInvoices,
  manualPayments,
  onRemoveInvoice,
  onRemoveManualPayment,
  onClearAllInvoices,
  onClearAllManualPayments,
  onBatchSubmitted,
}) => {
  const [paymentDate, setPaymentDate] = useState(getTodayDateString);
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { accounts, fetchAccounts, isLoading: isLoadingAccounts } = useXero();

  const { createBatch, loading: batchLoading } = usePaymentBatch();
  const { isSynced } = useXeroContext();

  useEffect(() => {
    if (isSynced) {
      const loadBankAccounts = async () => {
        try {
          await fetchAccounts({ where: 'Type=="BANK"' });
        } catch (error) {
          console.error("Failed to fetch bank accounts:", error);
        }
      };

      loadBankAccounts();
    }
  }, [isSynced]);

  const bankAccounts = accounts.filter((account) => account.isBankAccount);

  const allPayments = [...selectedInvoices, ...manualPayments];
  const totalAmount = allPayments.reduce(
    (sum, item) => sum + Number(item.amountDue || item.total || 0),
    0
  );

  const handleRemove = (item) => {
    if (item.isManualPayment) {
      onRemoveManualPayment(item.id);
    } else {
      onRemoveInvoice(item.id);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItemForDetails(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemForDetails(null);
  };

  const handleSubmitClick = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    const selectedAccount = bankAccounts.find(
      (account) => account.accountID === selectedBankAccount
    );

    const submitData = {
      PaymentDate: paymentDate,
      AccountID: selectedBankAccount,
      BankAccountNumber: selectedAccount?.bankAccountNumber || "",
      BankCode: selectedAccount?.code || "",
      BankName: selectedAccount?.name || "",
      invoices: selectedInvoices.map((invoice) => ({
        ...invoice,
        contactID: invoice.contact?.contactID || "",
      })),
      manualPayments: manualPayments,
    };

    console.log("Submitting payment batch with data:", submitData);

    try {
      await createBatch(submitData);
      toast.success("Payment batch created successfully!");
      setPaymentDate(getTodayDateString);
      setSelectedBankAccount("");
      onClearAllInvoices && onClearAllInvoices();
      onClearAllManualPayments && onClearAllManualPayments();
      onBatchSubmitted && onBatchSubmitted();
      setIsConfirmationModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to create payment batch");
    }
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationModalOpen(false);
  };

  const supplierSummary = allPayments.reduce((acc, curr) => {
    const supplier = curr.contactName || curr.supplier;
    if (!acc[supplier]) {
      acc[supplier] = {
        totalAmount: 0,
        count: 0,
        items: [],
      };
    }
    acc[supplier].totalAmount += Number(curr.amountDue || curr.total || 0);
    acc[supplier].count += 1;
    acc[supplier].items.push(curr);
    return acc;
  }, {});

  const selectedAccount = bankAccounts.find(
    (account) => account.accountID === selectedBankAccount
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Payment Batch</h2>
        <span className="text-xs px-2 py-1 bg-primary text-white rounded-full">
          {allPayments.length} selected
        </span>
      </div>

      {/* Payments List */}
      <div className="mb-6 max-h-96 overflow-y-auto">
        <PaymentSummaryList
          supplierSummary={supplierSummary}
          onViewDetails={handleViewDetails}
          onRemove={handleRemove}
        />
      </div>

      {/* Payment Details Section */}
      <div className="mb-6 space-y-4 p-2 rounded-lg">
        <h3 className="font-medium text-gray-900">Payment Details</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="payment-date">Payment Date</Label>
            <Input
              id="payment-date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-1"
            />
          </div>
          {isSynced && (
            <div>
              <Label htmlFor="bank-account">Bank Account</Label>
              <Select
                value={selectedBankAccount}
                onValueChange={setSelectedBankAccount}
                disabled={isLoadingAccounts}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={
                      isLoadingAccounts
                        ? "Loading bank accounts..."
                        : "Select bank account"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem
                      key={account.accountID}
                      value={account.accountID}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {account.name} -{" "}
                          {truncateBankAccountNumber(account.bankAccountNumber)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Total Payment
          </span>
          <span className="text-lg font-bold text-gray-800">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1">
          Save Draft
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmitClick}
          disabled={
            !paymentDate ||
            !selectedBankAccount ||
            allPayments.length === 0 ||
            batchLoading
          }
        >
          Finalize
        </Button>
      </div>

      <PaymentDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        itemDetails={selectedItemForDetails}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmSubmit}
        title="Confirm Payment Batch"
        message="Please review the payment batch details before finalizing. This action cannot be undone."
        confirmText="Finalize Batch"
        cancelText="Cancel"
        variant="info"
        isLoading={batchLoading}
        loadingText="Creating batch..."
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date:</span>
                <span className="font-medium">{paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Account:</span>
                <span className="font-medium">
                  {selectedAccount?.name} -{" "}
                  {truncateBankAccountNumber(
                    selectedAccount?.bankAccountNumber
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{allPayments.length}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ConfirmationModal>
    </Card>
  );
};

PaymentSummary.propTypes = {
  selectedInvoices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      total: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      contactName: PropTypes.string,
      contact: PropTypes.shape({
        contactID: PropTypes.string,
      }),
      lineItems: PropTypes.array,
      description: PropTypes.string,
      amountCredited: PropTypes.number,
      amountDue: PropTypes.number,
      currencyCode: PropTypes.string,
      subTotal: PropTypes.number,
      totalTax: PropTypes.number,
      invoiceNumber: PropTypes.string,
      reference: PropTypes.string,
      isManualPayment: PropTypes.bool,
    })
  ).isRequired,
  manualPayments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      total: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      supplier: PropTypes.string,
      contactName: PropTypes.string,
      description: PropTypes.string,
      payment_reference: PropTypes.string,
      isManualPayment: PropTypes.bool,
    })
  ).isRequired,
  onRemoveInvoice: PropTypes.func.isRequired,
  onRemoveManualPayment: PropTypes.func.isRequired,
  onClearAllInvoices: PropTypes.func,
  onClearAllManualPayments: PropTypes.func,
  onBatchSubmitted: PropTypes.func,
};
