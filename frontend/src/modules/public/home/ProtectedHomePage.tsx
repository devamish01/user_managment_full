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
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Checking authentication
          </span>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <HomePage />
    </AdminLayout>
  );
};

export default ProtectedHomePage;