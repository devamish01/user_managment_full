/**
 * AdminLayout — assembles the admin shell.
 * Composition only: Sidebar + Header + main content + Footer.
 * No Sidebar/Header implementation lives here.
 */

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Header onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
