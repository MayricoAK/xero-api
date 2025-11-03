import { SupplierBillList } from "@/components/invoices/SupplierBillList";

const SupplierBillsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Supplier Bills</h1>
      <SupplierBillList />
    </div>
  );
};

export default SupplierBillsPage;
