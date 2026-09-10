/**
 * AdminLayout — assembles the admin shell.
 * Composition only: Sidebar + Header + main content + Footer.
 * No Sidebar/Header implementation lives here.
 */

import * as React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { PublicHeader } from "@/shared/components/PublicHeader";
import { Footer } from "./Footer";
import { useAuth } from "@/modules/auth/hooks";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <PublicHeader
          showAuthButtons={!isAuthenticated && !isAuthPage}
          showUserDropdown={isAuthenticated}
          onMenu={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 pt-16 md:p-6 md:pt-16 lg:p-8 lg:pt-16">
          <div className="mx-auto animate-in">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
