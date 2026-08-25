"use client";

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PublicHeader } from "@/shared/components/PublicHeader";
import { PublicFooter } from "./PublicFooter";

interface PublicLayoutProps {
  children?: React.ReactNode;
  hideAuthButtons?: boolean;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, hideAuthButtons = false }) => {
  const location = useLocation();

  // Auto-hide auth buttons on login/register pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const shouldHideAuthButtons = hideAuthButtons || isAuthPage;

  const navigation = [
    { label: "Home", href: "/home" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader
        showAuthButtons={!shouldHideAuthButtons}
        showUserDropdown={false}
        navigation={navigation}
        showMobileMenu={true}
      />

      {/* Main Content */}
      <main className="flex-1 pt-16" id="main-content">
        {children || <Outlet />}
      </main>

      <PublicFooter />
    </div>
  );
};