export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatDateString = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getUserInitials = (userName) => {
  if (!userName || typeof userName !== "string") {
    return "AA";
  }

  const cleanName = userName.trim();
  return cleanName.slice(0, 2).toUpperCase();
};

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "warning";
    case "PAID":
    case "COMPLETED":
      return "success";
    case "OVERDUE":
      return "destructive";
    default:
      return "secondary";
  }
};

export const invoiceStatusColors = {
  DRAFT: "bg-gray-200 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  AUTHORISED: "bg-indigo-100 text-indigo-800",
  PAID: "bg-green-100 text-green-800",
  DELETED: "bg-red-100 text-red-800",
  VOIDED: "bg-yellow-100 text-yellow-800",
};

export const getApplicableTaxRates = (allTaxRates, accountTaxType) => {
  if (!accountTaxType || !allTaxRates.length) return [];

  return allTaxRates.filter((taxRate) => {
    switch (accountTaxType.toLowerCase()) {
      case "input":
        return (
          taxRate.canApplyToExpenses ||
          taxRate.reportTaxType === "INPUT" ||
          taxRate.reportTaxType === "PURCHASESINPUT"
        );
      case "output":
        return (
          taxRate.canApplyToRevenue ||
          taxRate.reportTaxType === "OUTPUT" ||
          taxRate.reportTaxType === "SALESOUTPUT"
        );
      case "none":
        return taxRate.taxType === "NONE" || taxRate.effectiveRate === 0;
      default:
        return (
          taxRate.canApplyToExpenses ||
          taxRate.canApplyToAssets ||
          taxRate.effectiveRate === 0
        );
    }
  });
};

export const truncateBankAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length <= 4) {
    return accountNumber;
  }
  const lastFour = accountNumber.slice(-4);
  const masked = "*".repeat(Math.max(3, accountNumber.length - 4));
  return `${masked}${lastFour}`;
};

export function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getTodayDateTimeString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const hh = String(today.getHours()).padStart(2, "0");
  const min = String(today.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
