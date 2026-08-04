import * as React from "react";
import { LoginHeader } from "../components/LoginHeader";
import { RegisterCard } from "../components/RegisterCard";

export const RegisterPage: React.FC = () => (
  <div className="min-h-screen w-full bg-[#0e1418]">
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <section className="min-h-[40vh] lg:min-h-screen">
        <LoginHeader
          title="Create your workspace account."
          subtitle="Register a new identity to manage users, roles, permissions, and systems."
        />
      </section>
      <section className="min-h-[60vh] lg:min-h-screen">
        <RegisterCard />
      </section>
    </div>
  </div>
);
