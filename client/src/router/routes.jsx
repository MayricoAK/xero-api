import { ProtectedRoute } from "../components/ProtectedRoute";
import { NotFoundPage } from "../components/ErrorPage";
import { PublicRoute } from "@/components/PublicRoute";
import LoginPage from "@/pages/LoginPage";
import Layout from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage";
import RequestApproval from "@/pages/RequestApproval";
import XeroCallbackRedirect from "@/pages/XeroCallbackRedirect";
import SupplierBillsPage from "@/pages/SupplierBillsPage";
import { ManualPaymentsPage } from "@/pages/ManualPaymentsPage";
import ApprovalPage from "@/pages/ApprovalPage";

const privateRoutes = {
  path: "/",
  element: (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "dashboard", element: <DashboardPage /> },
    { path: "request-approval", element: <RequestApproval /> },
    { path: "approval-authorization", element: <ApprovalPage /> },
    { path: "bills", element: <SupplierBillsPage /> },
    { path: "manual-payments", element: <ManualPaymentsPage /> },
    { path: "xero/callback", element: <XeroCallbackRedirect /> },
  ],
};

const publicRoutes = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
];

export const routes = [
  ...publicRoutes,
  privateRoutes,
  { path: "*", element: <NotFoundPage /> },
];
