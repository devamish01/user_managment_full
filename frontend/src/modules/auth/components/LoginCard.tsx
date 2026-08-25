/**
 * LoginCard — modern card for the sign-in form.
 *
 * Matches the home page design language with clean cards,
 * consistent theme colors, and modern styling.
 */

import * as React from "react";
import { LoginForm } from "./LoginForm";
import { cn } from "@/utils/cn";

export interface LoginCardProps {
  edition?: string;
  footnote?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  edition = "v2.0",
  footnote = "Need access? Contact your workspace administrator.",
}) => (
  <div className={cn(
    "relative flex h-full flex-col justify-between",
    "bg-card border border-border rounded-2xl p-8 sm:p-10 lg:p-12",
    "shadow-xl"
  )}>
    <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-muted-foreground mb-8">
      <span>{edition}</span>
      <span>Secure Access</span>
    </div>

    <div className="py-4 space-y-6">
      <p className="mb-2 text-base italic text-muted-foreground text-center">
        "Access, granted with intent."
      </p>
      <LoginForm />
    </div>

    <p className="border-t border-border pt-5 text-xs uppercase tracking-wider text-muted-foreground text-center">
      {footnote}
    </p>
  </div>
);
