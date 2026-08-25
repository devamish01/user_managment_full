"use client";

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks";
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import { PublicLayout } from "./PublicLayout";

/**
 * ProtectedPublicLayout - Renders public pages with appropriate layout based on auth state
 * - Unauthenticated: PublicLayout (no sidebar, public header with mobile drawer)
 * - Authenticated: AdminLayout (with sidebar, admin header)
 * 
 * This ensures consistent navigation experience across all public pages (Home, About, Contact, etc.)
 */
export const ProtectedPublicLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Hide auth buttons on auth pages (login, register)
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthenticated) {
    return (
      <AdminLayout>
        {children || <Outlet />}
      </AdminLayout>
    );
  }

  return (
    <PublicLayout hideAuthButtons={isAuthPage}>
      {children || <Outlet />}
    </PublicLayout>
  );
};

export default ProtectedPublicLayout;