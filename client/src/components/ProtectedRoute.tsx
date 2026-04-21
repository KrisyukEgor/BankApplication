import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../app/auth/useAuthStore";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  allowedRoles?: string[];
};

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}