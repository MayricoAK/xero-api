import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileSearch, FileText, ChevronRight } from "lucide-react";

const HomePage = () => {
  // Mock data for pending approvals
  const pendingApprovals = [
    {
      id: "PAY-001",
      date: "2023-11-15",
      description: "Vendor payment batch",
      amount: 12500.0,
      initiator: "john.doe@company.com",
      status: "pending",
    },
    {
      id: "PAY-002",
      date: "2023-11-14",
      description: "Office supplies invoice",
      amount: 2450.75,
      initiator: "jane.smith@company.com",
      status: "pending",
    },
  ];

  // Mock data for recent payments
  const recentPayments = [
    {
      id: "PAY-003",
      date: "2025-05-28",
      description: "Software subscription",
      amount: 899.0,
      status: "approved",
    },
    {
      id: "PAY-004",
      date: "2025-05-27",
      description: "Marketing services",
      amount: 3500.0,
      status: "approved",
    },
    {
      id: "PAY-005",
      date: "2025-05-26",
      description: "Utility bills",
      amount: 1820.5,
      status: "rejected",
    },
  ];

  return (
    <div className="mx-auto p-4 md:p-8">
      <div className="px-4 sm:px-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
          Dashboard
        </h1>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Pending Approvals
                  </CardTitle>
                  <CardDescription className="mt-1 text-3xl font-semibold text-gray-900">
                    5
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Approved This Month
                  </CardTitle>
                  <CardDescription className="mt-1 text-3xl font-semibold text-green-600">
                    $24,850.25
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Rejected This Month
                  </CardTitle>
                  <CardDescription className="mt-1 text-3xl font-semibold text-red-600">
                    $1,820.50
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Approvals */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Pending Approvals</CardTitle>
                      <CardDescription>
                        Requests awaiting your action
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Initiator</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((approval) => (
                        <TableRow key={approval.id}>
                          <TableCell className="font-medium">
                            {approval.id}
                          </TableCell>
                          <TableCell>{approval.description}</TableCell>
                          <TableCell>
                            ${approval.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>{approval.initiator}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Payments */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Payments</CardTitle>
                      <CardDescription>
                        Your recent payment activities
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.id}
                          </TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>
                            ${payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "approved"
                                  ? "success"
                                  : payment.status === "rejected"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Create new payment batches or approvals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Payment Batch
                    </Button>
                    <Button variant="outline">
                      <FileSearch className="mr-2 h-4 w-4" />
                      View Xero Invoices
                    </Button>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      View Xero Bills
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
