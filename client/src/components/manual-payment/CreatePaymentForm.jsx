import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DollarSign, Plus, Trash2, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { manualPaymentValidation } from "@/schemas/manualPaymentValidation";
import { defaultMPayLineItem, manualPaymentFormData } from "@/utils/formData";
import { useXero } from "@/hooks/useXero";
import { getApplicableTaxRates } from "@/utils";
import SelectedContact from "./SelectedContact";
import { taxTypeOptions } from "@/utils/data";

export function CreatePaymentForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(manualPaymentFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const {
    accounts,
    contacts: searchedContacts,
    taxRates: allTaxRates,
    isLoading,
    fetchContacts,
    fetchAccounts,
    fetchTaxRates,
  } = useXero();

  const contactInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchAccounts({
          where: 'Type!="BANK"',
        }),
        fetchTaxRates(),
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load form data");
    }
  };

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (contactSearchTerm.trim() && contactSearchTerm.length >= 2) {
        await searchContacts(contactSearchTerm);
      } else {
        setShowContactDropdown(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [contactSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !contactInputRef.current?.contains(event.target)
      ) {
        setShowContactDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchContacts = async (searchTerm) => {
    try {
      setIsSearching(true);
      const response = await fetchContacts({
        searchTerm: searchTerm,
        where: "IsSupplier==true",
        page: 1,
        pageSize: 10,
      });
      console.log("Searched contacts:", searchedContacts);

      if (response.success) {
        setShowContactDropdown(searchedContacts?.length > 0);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      toast.error("Failed to search contacts");
    } finally {
      setIsSearching(false);
    }
  };

  const handleContactSelect = (contact) => {
    const bankAccountNumber =
      contact.bankAccountDetails ||
      contact.batchPayments?.bankAccountNumber ||
      "";

    setSelectedContact(contact);
    setContactSearchTerm(contact.name);
    setFormData((prev) => ({
      ...prev,
      contact_id: contact.contactID,
      contact_name: contact.name,
      bankAccountNumber: bankAccountNumber,
    }));
    setShowContactDropdown(false);
    console.log("Selected contact:", contact);

    if (errors.contact_name) {
      setErrors((prev) => ({
        ...prev,
        contact_name: "",
      }));
    }
  };

  const handleContactInputChange = (value) => {
    setContactSearchTerm(value);

    if (selectedContact && value !== selectedContact.name) {
      setSelectedContact(null);
      setFormData((prev) => ({
        ...prev,
        contact_id: null,
        contact_name: value,
        bankAccountNumber: "",
      }));
    } else if (!selectedContact) {
      setFormData((prev) => ({
        ...prev,
        contact_name: value,
      }));
    }

    if (errors.contact_name) {
      setErrors((prev) => ({
        ...prev,
        contact_name: "",
      }));
    }
  };

  const calculateLineAmount = (quantity, unitAmount) => {
    return parseFloat((quantity * unitAmount).toFixed(2));
  };

  const calculateTotalAmount = () => {
    return formData.lines
      .reduce((total, line) => {
        const lineAmount = line.line_amount || 0;
        const taxAmount = lineAmount * (line.tax_rate || 0);
        return total + lineAmount + taxAmount;
      }, 0)
      .toFixed(2);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLines = [...formData.lines];
    updatedLines[index] = {
      ...updatedLines[index],
      [field]: value,
    };

    if (field === "accountID") {
      const selectedAccount = accounts.find((acc) => acc.accountID === value);
      if (selectedAccount) {
        updatedLines[index].tax_type = selectedAccount?.taxType;
        updatedLines[index].tax_rate = 0;
        updatedLines[index].tax_name = "";
      }
    }

    if (field === "quantity" || field === "unit_amount") {
      const quantity =
        field === "quantity"
          ? parseFloat(value) || 0
          : updatedLines[index].quantity;
      const unitAmount =
        field === "unit_amount"
          ? parseFloat(value) || 0
          : updatedLines[index].unit_amount;
      updatedLines[index].line_amount = calculateLineAmount(
        quantity,
        unitAmount
      );
    }

    setFormData((prev) => ({
      ...prev,
      lines: updatedLines,
    }));

    const errorKey = `lines.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, { ...defaultMPayLineItem }],
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lines.length > 1) {
      const updatedLines = formData.lines.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        lines: updatedLines,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = manualPaymentValidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Creating manual payment...");

    try {
      const submitData = {
        ...formData,
        lines: formData.lines.map((line) => ({
          ...line,
          quantity: parseFloat(line.quantity),
          unit_amount: parseFloat(line.unit_amount),
          line_amount: parseFloat(line.line_amount),
          tax_rate: parseFloat(line.tax_rate),
        })),
      };
      console.log("Submitting payment data:", submitData);

      const result = await onSubmit(submitData);
      console.log("Payment creation result form:", result);

      // Dismiss loading toast first
      toast.dismiss(loadingToast);

      if (result.success) {
        setFormData(manualPaymentFormData);
        setErrors({});
        setContactSearchTerm("");
        setSelectedContact(null);

        toast.success("Payment created successfully!");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to create payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter active tax rates
  const activeTaxRates = allTaxRates.filter((rate) => rate.status === "ACTIVE");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Details Section */}
      <div className="space-y-4">
        <div className="space-y-2 relative">
          <Label htmlFor="contact_search">Supplier Name *</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={contactInputRef}
              id="contact_search"
              placeholder="Search for a supplier..."
              value={contactSearchTerm}
              onChange={(e) => handleContactInputChange(e.target.value)}
              onFocus={() => {
                if (searchedContacts.length > 0) {
                  setShowContactDropdown(true);
                }
              }}
              className={cn(
                "pl-8 pr-8",
                errors.contact_name ? "border-red-500" : ""
              )}
            />
            {selectedContact && (
              <Check className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
            )}
            {isSearching && (
              <div className="absolute right-2 top-2.5">
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
              </div>
            )}
          </div>

          {/* Contact Dropdown */}
          {showContactDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {searchedContacts.length > 0 ? (
                searchedContacts.map((contact) => (
                  <div
                    key={contact.contactID}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500">
                      {contact.emailAddress && (
                        <span className="mr-3">{contact.emailAddress}</span>
                      )}
                      {(contact.bankAccountDetails ||
                        contact.batchPayments?.bankAccountNumber) && (
                        <span>
                          Bank:{" "}
                          {contact.bankAccountDetails ||
                            contact.batchPayments?.bankAccountNumber}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No suppliers found
                </div>
              )}
            </div>
          )}

          {errors.contact_name && (
            <p className="text-sm text-red-500">{errors.contact_name}</p>
          )}
        </div>

        {/* Show selected contact info */}
        {selectedContact && <SelectedContact data={selectedContact} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter payment description (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxIncl">Tax Treatment *</Label>
            <Select
              value={formData.taxIncl}
              onValueChange={(value) => handleInputChange("taxIncl", value)}
            >
              <SelectTrigger className={errors.taxIncl ? "border-red-500" : ""}>
                <SelectValue placeholder="Select tax treatment" />
              </SelectTrigger>
              <SelectContent>
                {taxTypeOptions.map((taxType) => (
                  <SelectItem key={taxType.value} value={taxType.value}>
                    {taxType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.taxIncl && (
              <p className="text-sm text-red-500">{errors.taxIncl}</p>
            )}
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Line Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLineItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {formData.lines.map((line, index) => {
          const selectedAccount = accounts.find(
            (acc) => acc.accountID === line.accountID
          );
          const applicableTaxRates = selectedAccount
            ? getApplicableTaxRates(activeTaxRates, selectedAccount.taxType)
            : [];

          return (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Item {index + 1}</h4>
                {formData.lines.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`line_description_${index}`}>
                    Description *
                  </Label>
                  <Input
                    id={`line_description_${index}`}
                    placeholder="Item description"
                    value={line.description}
                    onChange={(e) =>
                      handleLineItemChange(index, "description", e.target.value)
                    }
                    className={
                      errors[`lines.${index}.description`]
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors[`lines.${index}.description`] && (
                    <p className="text-sm text-red-500">
                      {errors[`lines.${index}.description`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`accountID_${index}`}>Account *</Label>
                  <Select
                    value={line.accountID || ""}
                    onValueChange={(value) =>
                      handleLineItemChange(index, "accountID", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className={
                        errors[`lines.${index}.accountID`]
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue
                        placeholder={
                          isLoading ? "Loading accounts..." : "Select account"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.accountID}
                          value={account.accountID}
                        >
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`lines.${index}.accountID`] && (
                    <p className="text-sm text-red-500">
                      {errors[`lines.${index}.accountID`]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`quantity_${index}`}>Quantity *</Label>
                  <Input
                    id={`quantity_${index}`}
                    type="number"
                    min="1"
                    step="1"
                    value={line.quantity}
                    onChange={(e) =>
                      handleLineItemChange(index, "quantity", e.target.value)
                    }
                    className={
                      errors[`lines.${index}.quantity`] ? "border-red-500" : ""
                    }
                  />
                  {errors[`lines.${index}.quantity`] && (
                    <p className="text-sm text-red-500">
                      {errors[`lines.${index}.quantity`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`unit_amount_${index}`}>Unit Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`unit_amount_${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      className={cn(
                        "pl-8",
                        errors[`lines.${index}.unit_amount`]
                          ? "border-red-500"
                          : ""
                      )}
                      value={line.unit_amount}
                      onChange={(e) =>
                        handleLineItemChange(
                          index,
                          "unit_amount",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  {errors[`lines.${index}.unit_amount`] && (
                    <p className="text-sm text-red-500">
                      {errors[`lines.${index}.unit_amount`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`tax_rate_${index}`}>Tax Rate</Label>
                  <Select
                    key={`tax_rate_${index}`}
                    value={line.tax_name || "0"}
                    onValueChange={(taxTypeValue) => {
                      const updatedLines = [...formData.lines];

                      if (taxTypeValue === "0") {
                        updatedLines[index] = {
                          ...updatedLines[index],
                          tax_rate: 0,
                          tax_name: "",
                        };
                      } else {
                        const selectedTaxRate = applicableTaxRates.find(
                          (rate) => rate.taxType === taxTypeValue
                        );

                        if (selectedTaxRate) {
                          const rate = selectedTaxRate.effectiveRate / 100;
                          updatedLines[index] = {
                            ...updatedLines[index],
                            tax_rate: rate,
                            tax_name: selectedTaxRate.taxType,
                          };
                        }
                      }

                      setFormData((prev) => ({
                        ...prev,
                        lines: updatedLines,
                      }));

                      const errorKey = `lines.${index}.tax_rate`;
                      if (errors[errorKey]) {
                        setErrors((prev) => ({
                          ...prev,
                          [errorKey]: "",
                        }));
                      }
                    }}
                    disabled={isLoading || !line.accountID}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoading
                            ? "Loading..."
                            : !line.accountID
                            ? "Select account first"
                            : "Select tax rate"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="no-tax" value="0">
                        No Tax (0%)
                      </SelectItem>
                      {applicableTaxRates.map((taxRate) => (
                        <SelectItem
                          key={taxRate.taxType}
                          value={taxRate.taxType}
                        >
                          {taxRate.name} ({taxRate.effectiveRate}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Line Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-8 bg-muted"
                      value={line.line_amount.toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {errors.lines && <p className="text-sm text-red-500">{errors.lines}</p>}
      </div>

      {/* Total Amount Display */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total Amount (including tax):</span>
          <span>
            {formData.currency_code} {calculateTotalAmount()}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || isSubmitting || isLoading}
        className="w-full"
      >
        {loading || isSubmitting ? "Creating..." : "Create Payment"}
      </Button>
    </form>
  );
}

// PropTypes validation
CreatePaymentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
