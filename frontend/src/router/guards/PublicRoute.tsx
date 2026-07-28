/**
 * PublicRoute Guard
 * Wraps routes that should only be accessible when NOT authenticated (e.g. Login).
 * In Phase 8, this simply renders the Outlet to avoid breaking existing logic.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicRoute: React.FC = () => {
  // Redirection logic will be added here in later phases.
  return <Outlet />;
};

export default PublicRoute;
