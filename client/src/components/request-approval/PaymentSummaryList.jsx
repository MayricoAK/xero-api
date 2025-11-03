import PropTypes from "prop-types";
import { Eye, Trash2 } from "lucide-react";

export const PaymentSummaryList = ({
  supplierSummary,
  onViewDetails,
  onRemove,
}) => {
  if (Object.keys(supplierSummary).length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">No payments selected</div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(supplierSummary).map(([supplier, summary]) => (
        <div
          key={supplier}
          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900">{supplier}</span>
            <span className="text-sm text-gray-500">
              {summary.count} {summary.count === 1 ? "payment" : "payments"}
            </span>
          </div>
          <div className="text-sm space-y-1">
            {summary.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-gray-600"
              >
                <div className="flex-1 truncate">
                  {item.invoiceNumber ||
                    item.payment_reference ||
                    item.description ||
                    item.id.substring(0, 8)}
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    ${Number(item.amountDue || item.total || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onViewDetails(item)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="View payment details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemove(item)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove payment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
              <span>Supplier Total</span>
              <span className="text-primary">
                ${summary.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

PaymentSummaryList.propTypes = {
  supplierSummary: PropTypes.objectOf(
    PropTypes.shape({
      totalAmount: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          total: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
          invoiceNumber: PropTypes.string,
          payment_reference: PropTypes.string,
          description: PropTypes.string,
          contactName: PropTypes.string,
          supplier: PropTypes.string,
          isManualPayment: PropTypes.bool,
        })
      ).isRequired,
    })
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
