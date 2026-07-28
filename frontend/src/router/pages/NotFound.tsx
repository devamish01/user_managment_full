/**
 * NotFound Page
 * Reusable minimal 404 page for React Router.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SharedButton } from '@/shared/components';
import { dashboardRoutesConfig } from '@/modules/dashboard.routes';
import { FileQuestion } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <FileQuestion size={40} className="text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
      <p className="text-xl font-medium text-foreground mb-4">Page not found</p>
      <p className="text-muted-foreground max-w-xs mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <SharedButton onClick={() => navigate(dashboardRoutesConfig.root())}>
        Back to Dashboard
      </SharedButton>
    </div>
  );
};

export default NotFound;
