import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../app/auth/useAuthStore";

type ProtectedRouteProps = {
  children?: React.ReactNode;
 
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
