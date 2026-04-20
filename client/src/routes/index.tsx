// src/routes/index.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/layout/Layout";

// pages
import { LoginPage }from  "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";

export function AppRouter() {
  return (
    <Routes>
      {/* Отдельно /auth/... */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Все защищённые маршруты обернуты в Layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["USER", "WORKER", "ADMIN"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {/* можно добавить /profile, /accounts и т.д. — все в Layout */}
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
