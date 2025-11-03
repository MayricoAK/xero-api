import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils";

export const PaymentDetailsModal = ({ isOpen, onClose, itemDetails }) => {
  if (!itemDetails) {
    return null;
  }

  const isManualPayment = itemDetails.isManualPayment;
  const supplierName = itemDetails.contactName || itemDetails.supplier;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl min-w-[320px] max-h-[90vh] min-h-[400px] p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="bg-gray-50 px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-medium text-gray-900">
                Bill Details
              </DialogTitle>
              <DialogDescription>
                {isManualPayment
                  ? "Details from manual payment."
                  : "Details from automated payment (Xero)."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {/* Bill Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-3 mb-6">
            {supplierName && (
              <div className="sm:col-span-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Supplier Name
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1 break-words">
                  {supplierName}
                </div>
              </div>
            )}

            {itemDetails.invoiceNumber && (
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Bill Number
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1 break-words">
                  {itemDetails.invoiceNumber}
                </div>
              </div>
            )}

            {itemDetails.status && (
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      itemDetails.status.toLowerCase() === "paid"
                        ? "bg-green-100 text-green-800"
                        : itemDetails.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : itemDetails.status.toLowerCase() === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {itemDetails.status}
                  </span>
                </div>
              </div>
            )}

            {itemDetails.reference && (
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Reference
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1 break-words">
                  {itemDetails.reference}
                </div>
              </div>
            )}

            {itemDetails.date && (
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Date
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {formatDate(itemDetails.date)}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Payment Type
              </div>
              <div className="text-sm font-medium text-gray-900 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isManualPayment
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {isManualPayment ? "Manual Payment" : "Xero Invoice"}
                </span>
              </div>
            </div>

            {itemDetails.dueDate && (
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Due Date
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {formatDate(itemDetails.dueDate)}
                </div>
              </div>
            )}

            {itemDetails.description && (
              <div className="sm:col-span-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </div>
                <div className="text-sm text-gray-900 mt-1 break-words">
                  {itemDetails.description}
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          {itemDetails.lineItems && itemDetails.lineItems.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-900 mb-3">
                Items
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-2 text-right">Unit Price</div>
                      <div className="col-span-2 text-right">Amount</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {itemDetails.lineItems.map((line, index) => {
                      const unitAmount =
                        line.unitAmount || line.unit_amount || 0;
                      const lineTotal =
                        line.lineAmount ||
                        line.line_amount ||
                        unitAmount * line.quantity;

                      return (
                        <div key={index} className="px-4 py-3">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6 text-sm text-gray-900">
                              {line.description}
                            </div>
                            <div className="col-span-2 text-center text-sm text-gray-700">
                              {line.quantity}
                            </div>
                            <div className="col-span-2 text-right text-sm text-gray-700">
                              {formatCurrency(unitAmount)}
                            </div>
                            <div className="col-span-2 text-right text-sm font-medium text-gray-900">
                              {formatCurrency(lineTotal)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-gray-200">
                  {itemDetails.lineItems.map((line, index) => {
                    const unitAmount = line.unitAmount || line.unit_amount || 0;
                    const lineTotal =
                      line.lineAmount ||
                      line.line_amount ||
                      unitAmount * line.quantity;

                    return (
                      <div key={index} className="p-4 space-y-2">
                        <div className="text-sm font-medium text-gray-900 break-words">
                          {line.description}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {formatCurrency(unitAmount)}
                          </span>
                          <span className="text-gray-600">
                            x{line.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700">
                            Amount
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(lineTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Totals Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2">
              {itemDetails.subTotal && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(itemDetails.subTotal)}
                  </span>
                </div>
              )}

              {itemDetails.totalTax && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(itemDetails.totalTax)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-base font-medium text-gray-900">
                  Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(itemDetails.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status for Xero Bills */}
          {!isManualPayment && itemDetails.amountDue !== undefined && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">
                  Amount Due
                </span>
                <span
                  className={`text-sm font-semibold ${
                    itemDetails.amountDue > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {formatCurrency(itemDetails.amountDue)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t bg-gray-50 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex justify-between items-center text-base font-medium">
              <span>Total Amount (incl. tax):</span>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                {formatCurrency(itemDetails.total)}
              </span>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8 w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const lineItemShape = PropTypes.shape({
  description: PropTypes.string,
  quantity: PropTypes.number,
  unitAmount: PropTypes.number,
  unit_amount: PropTypes.number,
  lineAmount: PropTypes.number,
  line_amount: PropTypes.number,
});

PaymentDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemDetails: PropTypes.shape({
    contactName: PropTypes.string,
    supplier: PropTypes.string,
    invoiceNumber: PropTypes.string,
    status: PropTypes.string,
    reference: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    dueDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    isManualPayment: PropTypes.bool,
    total: PropTypes.number.isRequired,
    subTotal: PropTypes.number,
    totalTax: PropTypes.number,
    amountDue: PropTypes.number,
    lineItems: PropTypes.arrayOf(lineItemShape),
  }),
};
