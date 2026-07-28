/**
 * LoginPage — composition root for the sign-in surface.
 *
 * Pairs the editorial masthead (`LoginHeader`) with the sand-toned form
 * panel (`LoginCard`). Responsive: stacked on mobile, split-screen from
 * `lg` up. No routing is wired here — the page is mounted by the caller.
 */

import * as React from "react";
import { LoginHeader } from "../components/LoginHeader";
import { LoginCard } from "../components/LoginCard";

export const LoginPage: React.FC = () => (
  <div className="min-h-screen w-full bg-[#0e1418]">
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <section className="min-h-[40vh] lg:min-h-screen">
        <LoginHeader />
      </section>
      <section className="min-h-[60vh] lg:min-h-screen">
        <LoginCard />
      </section>
    </div>
  </div>
);
