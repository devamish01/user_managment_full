/**
 * LoginHeader — editorial masthead for the sign-in surface.
 *
 * Owns the brand mark, the publication-style kicker, the display headline
 * and a small "ambient status" strip. Pure presentational — no data, no
 * store access — so it can be reused or replaced without touching logic.
 */

import * as React from "react";

export interface LoginHeaderProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  kicker = "Nexus / Operations Console",
  title = "Sign in to your workspace.",
  subtitle = "One identity for users, roles, permissions, and the systems that bind them together.",
}) => (
  <header className="relative flex h-full flex-col justify-between gap-10 p-8 text-[#f4ede0] sm:p-12">
    {/* Animated dot-grid masthead — a single ambient layer, not a blob field. */}
    <style>{`
      @keyframes nexus-grid-pan {
        0%   { background-position: 0 0; }
        100% { background-position: 40px 40px; }
      }
      @keyframes nexus-ticker {
        0%, 90%   { opacity: 1; }
        95%       { opacity: 0.2; }
        100%      { opacity: 1; }
      }
    `}</style>

    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(244,237,224,0.35) 1px, transparent 0)",
        backgroundSize: "20px 20px",
        animation: "nexus-grid-pan 18s linear infinite",
      }}
    />
    {/* Horizon line — a single bold rule, brutalist touch. */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-8 top-1/2 h-px bg-[#f4ede0]/20 sm:inset-x-12"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute left-8 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 sm:left-12"
      style={{ animation: "nexus-ticker 2.4s ease-in-out infinite" }}
    />

    <div className="relative flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#f4ede0] text-[#0e1418]">
        <span className="font-black leading-none tracking-tighter">N</span>
      </div>
      <span className="text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/70">
        {kicker}
      </span>
    </div>

    <div className="relative max-w-md">
      <h1 className="font-black leading-[0.95] tracking-[-0.04em] text-[clamp(2.25rem,5vw,3.75rem)]">
        {title}
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#f4ede0]/75">
        {subtitle}
      </p>
      <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/60">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
        <span className="h-3 w-px bg-[#f4ede0]/30" />
        <span>Mock identity · switchable</span>
      </div>
    </div>
  </header>
);
