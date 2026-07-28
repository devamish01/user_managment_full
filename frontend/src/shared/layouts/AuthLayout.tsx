/**
 * AuthLayout — unauthenticated shell for login/register pages.
 * 
 * This is a PREPARATORY layout for future auth pages.
 * Currently the project has no login page (mock auth is used).
 * When real authentication is added, this layout will provide
 * a centered card shell for login, register, forgot-password forms.
 */

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};
