import PropTypes from "prop-types";
import { PaginatedTable } from "@/components/table/PaginatedTable";
import { createPaymentBatchColumnsWithActions } from "@/utils/columnData";

const PaymentList = ({
  batches,
  totalItem,
  totalPages,
  currentPage,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
  onApprove,
  onDelete,
}) => {
  const columns = createPaymentBatchColumnsWithActions(onApprove, onDelete);

  return (
    <PaginatedTable
      data={batches}
      columns={columns}
      pagination={{
        page: currentPage,
        pageSize: pageSize,
        pageCount: totalPages,
        itemCount: totalItem,
      }}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      emptyMessage="No batch available"
      rowIdKey="id"
    />
  );
};

PaymentList.propTypes = {
  batches: PropTypes.array.isRequired,
  totalItem: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PaymentList;
