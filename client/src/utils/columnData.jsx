import { InvoiceTypeBadge } from "@/components/invoices/InvoiceTypeBadge";
import { formatCurrency, formatDate, getStatusVariant } from ".";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { Badge } from "@/components/ui/badge";
import { PaymentBatchStatusBadge } from "@/components/payment-batch/PaymentBatchStatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2 } from "lucide-react";

export const InvoiceColumns = [
  {
    key: "contact",
    header: "Contact",
    cellClassName: "font-medium",
    render: (row) => row.contact?.name || "Unknown Contact",
  },
  {
    key: "invoiceNumber",
    header: "Invoice #",
    render: (row) => row.invoiceNumber || row.invoiceID.substring(0, 8),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => formatDate(row.date),
  },
  {
    key: "dueDate",
    header: "Due Date",
    render: (row) => (row.dueDate ? formatDate(row.dueDate) : "-"),
  },
  {
    key: "type",
    header: "Type",
    render: (row) => <InvoiceTypeBadge type={row.type} />,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <InvoiceStatusBadge status={row.status} />,
  },
  {
    key: "reference",
    header: "Reference",
    render: (row) => row.reference || "-",
  },
  {
    key: "total",
    header: "Total",
    cellClassName: "text-right font-medium",
    render: (row) => formatCurrency(row.total, row.currencyCode),
  },
  {
    key: "amountDue",
    header: "Due",
    cellClassName: "text-right",
    render: (row) => formatCurrency(row.amountDue, row.currencyCode),
  },
  {
    key: "amountPaid",
    header: "Paid",
    cellClassName: "text-right text-green-600",
    render: (row) =>
      row.amountPaid > 0
        ? formatCurrency(row.amountPaid, row.currencyCode)
        : "-",
  },
];

export const RequestApprovalColumns = [
  {
    key: "contact",
    header: "Contact",
    cellClassName: "font-medium",
    render: (row) => row.contactName || "Unknown Contact",
  },
  {
    key: "invoiceNumber",
    header: "Invoice #",
    render: (row) => row.invoiceNumber || row.invoiceID.substring(0, 8),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => formatDate(row.date),
  },
  {
    key: "dueDate",
    header: "Due Date",
    render: (row) => (row.dueDate ? formatDate(row.dueDate) : "-"),
  },
  // {
  //   key: "type",
  //   header: "Type",
  //   render: (row) => <InvoiceTypeBadge type={row.type} />,
  // },
  // {
  //   key: "status",
  //   header: "Status",
  //   render: (row) => <InvoiceStatusBadge status={row.status} />,
  // },
  {
    key: "total",
    header: "Total",
    className: "text-right font-semibold font-mono",
    render: (row) => formatCurrency(row.total, row.currencyCode),
  },
  {
    key: "amountDue",
    header: "Due",
    className: "text-right font-semibold font-mono",
    render: (row) => formatCurrency(row.amountDue, row.currencyCode),
  },
];

export const RequestApprovalColumns2 = [
  {
    key: "supplier",
    header: "Supplier",
    cellClassName: "font-medium",
    render: (row) => row.supplier,
  },
  {
    key: "invoiceNumber",
    header: "Invoice #",
    render: (row) => row.invoiceNumber,
  },
  {
    key: "date",
    header: "Date",
    render: (row) => new Date(row.date).toLocaleDateString(),
  },
  {
    key: "dueDate",
    header: "Due Date",
    render: (row) => new Date(row.dueDate).toLocaleDateString(),
  },
  {
    key: "amount",
    header: "Amount",
    cellClassName: "text-right font-medium",
    render: (row) => `$${Number(row.amount).toFixed(2)}`,
  },
];

export const ManualPaymentColumns = [
  {
    header: "Payment Date",
    key: "payment_reference",
  },
  {
    header: "Description",
    key: "description",
    render: (row) => (
      <div className="max-w-[200px] truncate" title={row.description}>
        {row.description}
      </div>
    ),
  },
  {
    header: "Payment Date",
    key: "payment_date",
    render: (row) => (
      <span className="font-mono text-sm">{formatDate(row.payment_date)}</span>
    ),
  },
  {
    header: "Total Amount",
    key: "total_amount",
    render: (row) => (
      <span className="font-mono text-sm">
        {formatCurrency(row.total_amount)}
      </span>
    ),
  },
  {
    header: "Status",
    key: "status",
    render: (row) => (
      <Badge variant={getStatusVariant(row.status)}>
        {row.status || "N/A"}
      </Badge>
    ),
  },
];

export const PaymentBatchColumns = [
  {
    header: "Batch ID",
    key: "batchIdNumber",
    width: "w-32",
    className: "min-w-[8rem]",
  },
  {
    header: "Payment Date",
    key: "paymentDate",
    width: "w-36",
    className: "min-w-[9rem]",
    render: (row) => formatDate(row.paymentDate),
  },
  {
    header: "Bank Name",
    key: "bankName",
    width: "w-48",
    className: "min-w-[12rem] max-w-[12rem]",
    render: (row) => (
      <div className="truncate" title={row.bankName}>
        {row.bankName}
      </div>
    ),
  },
  {
    header: "Account Number",
    key: "bankAccountNumber",
    width: "w-40", 
    className: "min-w-[10rem]",
    render: (row) => (
      <span className="font-mono text-sm">{row.bankAccountNumber}</span>
    ),
  },
  {
    header: "Last Approval Date",
    key: "lastApprDate",
    width: "w-40",
    className: "min-w-[10rem]",
    render: (row) => (row.lastApprDate ? formatDate(row.lastApprDate) : "N/A"),
  },
  {
    header: "Entered Date",
    key: "entereddate",
    width: "w-36",
    className: "min-w-[9rem]",
    render: (row) => formatDate(row.entereddate),
  },
  {
    header: "Status",
    key: "isApproved",
    width: "w-28",
    className: "text-center min-w-[7rem]",
    render: (row) => <PaymentBatchStatusBadge isApproved={row.isApproved} />,
  },
  {
    header: "Amount To Approve",
    key: "amountToAppr",
    width: "w-40",
    className: "text-right font-semibold font-mono min-w-[10rem]",
    render: (row) => (
      <span className="text-right">
        {formatCurrency(row.amountToAppr)}
      </span>
    ),
  },
];

export const createPaymentBatchColumnsWithActions = (onApprove, onDelete) => [
  ...PaymentBatchColumns,
  {
    header: "Actions",
    key: "actions",
    width: "w-48",
    className: "min-w-[12rem]",
    render: (row) => (
      <div className="flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant={row.isApproved ? "secondary" : "default"}
          onClick={row.isApproved ? undefined : () => onApprove(row)}
          disabled={row.isApproved}
          className="h-8 w-24 px-3 text-xs"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          {row.isApproved ? "Approved" : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row)}
          className="h-8 w-20 px-3 text-xs"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </div>
    ),
  },
];
