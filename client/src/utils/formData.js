export const defaultMPayLineItem = {
  description: "",
  accountID: null,
  quantity: 1,
  unit_amount: 0,
  line_amount: 0,
  tax_type: "",
  tax_rate: 0,
  tax_name: "",
};

export const manualPaymentFormData = {
  payment_reference: "",
  description: "",
  payment_date: new Date().toISOString().split("T")[0],
  contact_id: null,
  contact_name: "",
  bankAccountNumber: "",
  currency_code: "SGD",
  payment_method: "BANK_TRANSFER",
  bankid: null,
  taxIncl: "Exclusive",
  status: "DRAFTED",
  lines: [{ ...defaultMPayLineItem }],
};
