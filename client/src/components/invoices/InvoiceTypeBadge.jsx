import { cn } from "@/lib/utils";

export function InvoiceTypeBadge({ type }) {
  const colors = {
    ACCPAY: "bg-amber-100 text-amber-800",
    ACCREC: "bg-purple-100 text-purple-800",
  };

  const labels = {
    ACCPAY: "ACCPAY",
    ACCREC: "ACCREC",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        colors[type] || "bg-gray-100 text-gray-800"
      )}
    >
      {labels[type] || type}
    </span>
  );
}
