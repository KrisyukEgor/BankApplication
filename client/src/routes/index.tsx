import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { TransactionsPage } from "../pages/dashboard/TransactionsPage";
import { TransferPage } from "../pages/dashboard/TransferPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/transfer" element={<TransferPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}