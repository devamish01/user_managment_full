import * as React from "react";
import { RegisterForm } from "./RegisterForm";
import { cn } from "@/utils/cn";

export interface RegisterCardProps {
  edition?: string;
  footnote?: string;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({
  edition = "v2.0",
  footnote = "Set up a new account and join the Nexus community.",
}) => (
  <div className={cn(
    "relative flex h-full flex-col justify-between",
    "bg-card border border-border rounded-2xl p-8 sm:p-10 lg:p-12",
    "shadow-xl"
  )}>
    <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-muted-foreground mb-8">
      <span>{edition}</span>
      <span>New Account</span>
    </div>

    <div className="py-4 space-y-6">
      <p className="mb-2 text-base italic text-muted-foreground text-center">
        "Bring your own identity into a shared community platform."
      </p>
      <RegisterForm />
    </div>

    <p className="border-t border-border pt-5 text-xs uppercase tracking-wider text-muted-foreground text-center">
      {footnote}
    </p>
  </div>
);
