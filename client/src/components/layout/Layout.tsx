// src/components/layout/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { useAuthStore } from "../../app/auth/useAuthStore";

export function Layout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthPage = location.pathname.startsWith("/auth");

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <>
      <Header /> {/* без user */}
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </>
  );
}
