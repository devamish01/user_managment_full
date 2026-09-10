/**
 * AppProviders
 * Centralised wrapper for all global context providers.
 * 
 * Composition Order:
 * Theme → Store → Toast → Router
 */

import React from "react";
import {
  ThemeProvider,
  StoreProvider,
} from "@/store";
import { ToastProvider } from "@/components/ui/toast";
import { AuthBootstrap } from "./AuthBootstrap";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AuthBootstrap>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthBootstrap>
      </StoreProvider>
    </ThemeProvider>
  );
};
