/**
 * Forbidden Page
 * Reusable minimal 403 page for React Router.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SharedButton } from '@/shared/components';
import { dashboardRoutesConfig } from '@/modules/dashboard.routes';
import { ShieldAlert } from 'lucide-react';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 mb-6">
        <ShieldAlert size={40} className="text-red-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">403</h1>
      <p className="text-xl font-medium text-foreground mb-4">Access Forbidden</p>
      <p className="text-muted-foreground max-w-xs mb-8">
        You don't have the required permissions to view this resource.
      </p>
      <SharedButton onClick={() => navigate(dashboardRoutesConfig.root())}>
        Back to Dashboard
      </SharedButton>
    </div>
  );
};

export default Forbidden;
