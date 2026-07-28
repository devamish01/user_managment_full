/**
 * UserSwitcher — role-based identity picker for the mock login surface.
 *
 * Emits the full demo credential set (roleId + email + password) pulled from
 * `core/authorization` so the credentials live with the authorization layer,
 * not the auth module. Each chip carries a gradient cue from `ROLE_DISPLAY`
 * and a small monospace credential hint.
 */

import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { ROLE_DISPLAY } from "@/core/authorization";

export interface UserSwitcherSelection {
  roleId: string;
  email: string;
  password: string;
}

export interface UserSwitcherProps {
  selectedRoleId: string;
  onSelect: (selection: UserSwitcherSelection) => void;
  disabled?: boolean;
}

export const UserSwitcher: React.FC<UserSwitcherProps> = ({
  selectedRoleId,
  onSelect,
  disabled = false,
}) => {
  const roles = Object.values(ROLE_DISPLAY);
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e1418]/55">
          Sign in as
        </p>
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#0e1418]/40">
          {roles.length} roles
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {roles.map((meta) => {
          const active = meta.id === selectedRoleId;
          return (
            <button
              key={meta.id}
              type="button"
              disabled={disabled}
              onClick={() =>
                onSelect({ roleId: meta.id, email: meta.email, password: meta.password })
              }
              aria-pressed={active}
              className={cn(
                "group relative flex flex-col items-start gap-2 overflow-hidden rounded-md border p-3 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "border-[#0e1418] bg-[#0e1418] text-[#f4ede0] shadow-md"
                  : "border-[#0e1418]/15 bg-white text-[#0e1418] hover:border-[#0e1418]/40",
              )}
            >
              <span
                className={cn(
                  "inline-block h-1.5 w-8 rounded-full bg-gradient-to-r transition-all",
                  meta.gradient,
                  active ? "opacity-100" : "opacity-70 group-hover:opacity-100",
                )}
              />
              <div className="leading-tight">
                <p className="text-xs font-black uppercase tracking-tight">{meta.label}</p>
                <p
                  className={cn(
                    "truncate font-mono text-[10px]",
                    active ? "text-[#f4ede0]/70" : "text-[#0e1418]/55",
                  )}
                >
                  {meta.email}
                </p>
              </div>
              {active && (
                <span className="absolute right-2 top-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
