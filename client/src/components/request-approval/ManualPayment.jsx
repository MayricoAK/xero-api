import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { CreatePaymentForm } from "@/components/manual-payment/CreatePaymentForm";
import PropTypes from "prop-types";

export const ManualPayment = ({ onAddPayment }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const result = await onAddPayment(formData);
      if (result && result.success !== false) {
        setShowForm(false);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Add Manual Payment
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Create a manual payment entry for the batch
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
          disabled={loading}
        >
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="mt-4 border-t pt-4">
          <CreatePaymentForm
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={handleCancel}
          />
        </div>
      )}
    </Card>
  );
};

ManualPayment.propTypes = {
  onAddPayment: PropTypes.func.isRequired,
};
