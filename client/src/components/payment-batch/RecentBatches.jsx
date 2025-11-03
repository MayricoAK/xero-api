import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentBatch } from "@/hooks/usePaymentBatch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils";
import { PaymentBatchStatusBadge } from "./PaymentBatchStatusBadge";

const RecentBatches = ({
  limit = 5,
  showViewAll = true,
  title = "Recent Payment Batches",
  description = "Recent payment activities",
  refreshTrigger = 0,
}) => {
  const navigate = useNavigate();
  const { batches, loading, error, fetchBatches } = usePaymentBatch();
  const [recentBatches, setRecentBatches] = useState([]);

  useEffect(() => {
    loadRecentBatches();
  }, [limit, refreshTrigger]);

  useEffect(() => {
    setRecentBatches(batches.slice(0, limit));
  }, [batches, limit]);

  const loadRecentBatches = async () => {
    try {
      await fetchBatches({ page: 1, size: limit });
    } catch (err) {
      console.error("Failed to fetch recent batches:", err);
    }
  };

  const handleViewAll = () => {
    navigate("/approval-authorization");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {showViewAll && (
              <Button variant="outline" size="sm" disabled>
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {showViewAll && (
              <Button variant="outline" size="sm" disabled>
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            Error loading batches: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showViewAll && (
            <Button variant="outline" size="sm" onClick={handleViewAll}>
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentBatches.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p>No recent payment batches found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBatches.map((batch) => (
                <TableRow key={batch.xoBatchId}>
                  <TableCell className="font-medium">
                    #{batch.batchIdNumber}
                  </TableCell>
                  <TableCell>{batch.paymentDate}</TableCell>
                  <TableCell>{batch.bankName}</TableCell>
                  <TableCell className="font-semibold font-mono text-right">
                    {formatCurrency(batch.amountToAppr)}
                  </TableCell>
                  <TableCell>
                    <PaymentBatchStatusBadge isApproved={batch.isApproved} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

RecentBatches.propTypes = {
  limit: PropTypes.number,
  showViewAll: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  refreshTrigger: PropTypes.number,
};

export default RecentBatches;
