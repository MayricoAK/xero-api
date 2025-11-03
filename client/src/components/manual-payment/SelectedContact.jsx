import { Check } from "lucide-react";

const SelectedContact = ({ data }) => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-center space-x-2">
        <Check className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          Selected: {data.name}
        </span>
      </div>
      {data.emailAddress && (
        <p className="text-sm text-green-700 mt-1">
          Email: {data.emailAddress}
        </p>
      )}
      {(data.bankAccountDetails || data.batchPayments?.bankAccountNumber) && (
        <p className="text-sm text-green-700">
          Bank Account:{" "}
          {data.bankAccountDetails || data.batchPayments?.bankAccountNumber}
        </p>
      )}
    </div>
  );
};

export default SelectedContact;
