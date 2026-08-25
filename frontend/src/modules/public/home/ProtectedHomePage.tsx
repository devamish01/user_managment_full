"use client";

import React from "react";
import { useAuth } from "@/modules/auth/hooks";
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { HomePage } from "./HomePage";

/**
 * ProtectedHomePage - Renders HomePage with appropriate layout based on auth state
 * - Unauthenticated: PublicLayout (no sidebar, public header)
 * - Authenticated: AdminLayout (with sidebar, admin header)
 */
export const ProtectedHomePage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AdminLayout>
        <HomePage />
      </AdminLayout>
    );
  }

  return (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  );
};

export default ProtectedHomePage;