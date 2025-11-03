export const manualPaymentValidation = (formData) => {
  const errors = {};

  if (!formData.description?.trim()) {
    errors.description = "Description is required";
  }

  if (!formData.contact_name.trim()) {
    errors.contact_name = "Contact name is required";
  }

  if (!/^[A-Z]{3}$/.test(formData.currency_code)) {
    errors.currency_code = "Please enter a valid 3-letter currency code";
  }

  if (!["Exclusive", "Inclusive", "NoTax"].includes(formData.taxIncl)) {
    errors.taxIncl = "Please select a valid tax treatment";
  }

  formData.lines.forEach((line, index) => {
    if (!line.description?.trim()) {
      errors[`lines.${index}.description`] = "Line description is required";
    }
    if (!line.accountID?.trim()) {
      errors[`lines.${index}.accountID`] = "Account code is required";
    }
    if (!line.quantity || line.quantity <= 0) {
      errors[`lines.${index}.quantity`] = "Quantity must be greater than 0";
    }
    if (!line.unit_amount || line.unit_amount <= 0) {
      errors[`lines.${index}.unit_amount`] =
        "Unit amount must be greater than 0";
    }
  });

  if (!formData.lines?.length) {
    errors.lines = "At least one line item is required";
  }

  return errors;
};
