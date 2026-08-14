import * as React from "react";
import { useParams, useNavigate, type RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { SharedButton } from "@/shared/components/SharedButton";
import { TransactionsPage, TransactionDetailsPage } from "@/modules/payments/pages";

/**
 * Payments Route Helpers
 */
export const paymentsRoutesConfig = {
  transactions: () => "/payments/transactions",
  transactionDetails: (id: string) => `/payments/transactions/${id}`,
  transactionEdit: (id: string) => `/payments/transactions/${id}/edit`,
  transactionCreate: () => "/payments/transactions/new",
};

const TransactionFormRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{id ? "Edit Transaction" : "New Transaction"}</h1>
      <p className="mt-4 text-gray-500">Transaction form page - to be implemented</p>
      <SharedButton onClick={() => navigate(paymentsRoutesConfig.transactions())} className="mt-4">
        Cancel
      </SharedButton>
    </div>
  );
};

/**
 * Payments Feature Routes
 */
export const paymentsRoutes: RouteObject[] = [
  {
    path: "payments",
    element: <PermissionGuard permission="pages.payments" />,
    children: [
      {
        path: "transactions",
        element: <PermissionGuard permission="pages.transactions" />,
        children: [
          { index: true, element: <TransactionsPage /> },
          { path: "new", element: <TransactionFormRoute /> },
          { path: ":id/edit", element: <TransactionFormRoute /> },
          { path: ":id", element: <TransactionDetailsPage /> },
        ],
      },
    ],
  },
];