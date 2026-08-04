import * as React from "react";
import { RegisterForm } from "./RegisterForm";

export interface RegisterCardProps {
  edition?: string;
  footnote?: string;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({
  edition = "No. 002",
  footnote = "Set up a new workspace account and continue to the admin console.",
}) => (
  <div className="relative flex h-full flex-col justify-between bg-[#f4ede0] p-8 sm:p-12">
    <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-[#0e1418]/55">
      <span>Register · {edition}</span>
      <span>New account</span>
    </div>

    <div className="py-8">
      <p className="mb-6 font-serif text-base italic text-[#0e1418]/70">
        “Bring your own identity into a shared operations workspace.”
      </p>
      <RegisterForm />
    </div>

    <p className="border-t border-[#0e1418]/10 pt-5 text-[11px] uppercase tracking-[0.22em] text-[#0e1418]/55">
      {footnote}
    </p>
  </div>
);
