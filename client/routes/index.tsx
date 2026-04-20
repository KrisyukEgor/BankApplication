// src/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Pages
import {LoginPage} from "../pages/auth/LoginPage";
import {RegisterPage} from "../pages/auth/RegisterPage";
import {ResetPasswordPage} from "../pages/auth/ResetPasswordPage";
import {DashboardPage} from "../pages/dashboard/DashboardPage";

export function AppRouter() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Защищённые маршруты (только после входа) */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["USER", "WORKER", "ADMIN"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Можно добавить дальше: profile, accounts, transactions и т.д. */}
    </Routes>
  );
}
