import { cn } from "@/lib/utils";
import { invoiceStatusColors } from "@/utils";

export function InvoiceStatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        invoiceStatusColors[status] || "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </span>
  );
}
