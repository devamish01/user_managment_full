/**
 * LoginCard — the paper-side panel that hosts the sign-in form.
 *
 * A single sand-toned card with editorial typographic rhythm. No blur, no
 * aurora, no rounded-3xl — just a tight rectangle with a bold number tag
 * and a hairline rule.
 */

import * as React from "react";
import { LoginForm } from "./LoginForm";

export interface LoginCardProps {
  edition?: string;
  footnote?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  edition = "No. 001",
  footnote = "Need access? Request it from your workspace administrator.",
}) => (
  <div className="relative flex h-full flex-col justify-between bg-[#f4ede0] p-8 sm:p-12">
    <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-[#0e1418]/55">
      <span>Sign-in · {edition}</span>
      <span>Mock identity</span>
    </div>

    <div className="py-8">
      <p className="mb-6 font-serif text-base italic text-[#0e1418]/70">
        “Access, granted with intent.”
      </p>
      <LoginForm />
    </div>

    <p className="border-t border-[#0e1418]/10 pt-5 text-[11px] uppercase tracking-[0.22em] text-[#0e1418]/55">
      {footnote}
    </p>
  </div>
);
