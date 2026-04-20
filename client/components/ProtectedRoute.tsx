import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: ("USER" | "WORKER" | "ADMIN")[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  
  return <>{children}</>;
}
