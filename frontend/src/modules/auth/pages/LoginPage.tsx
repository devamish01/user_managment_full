/**
 * LoginPage — composition root for the sign-in surface.
 *
 * Spacious two-column layout matching the home page design language.
 * Clean, accessible, and responsive with theme-aware colors.
 * Uses PublicHeader from PublicLayout for consistent header across all public pages.
 */

import * as React from "react";
import { Link } from "react-router-dom";
import { LoginCard } from "../components/LoginCard";
import { cn } from "@/utils/cn";

export const LoginPage: React.FC = () => (
  <div className={cn(
    "min-h-screen w-full flex items-center justify-center p-6 sm:p-10 lg:p-16",
    "bg-background"
  )}>
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
        {/* Left side - Branding/Features */}
        <section className="hidden lg:block min-h-[580px] flex flex-col justify-center">
          <div className="relative z-10 max-w-2xl w-full text-center">
            {/* Brand */}
            <div className="flex items-center gap-3 justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
                <span className="font-black text-primary-foreground text-xl">N</span>
              </div>
              <span className="font-black text-xl text-foreground">Nexus</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up">
              Welcome back
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto mb-10 animate-fade-in-up">
              Sign in to access events, giveaways, donations, and manage your payments securely.
            </p>

            {/* Feature highlights - matching HomePage What You Can Do */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto animate-fade-in-up">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Events</p>
                  <p className="text-xs text-muted-foreground">Workshops, conferences, meetups</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Giveaways</p>
                  <p className="text-xs text-muted-foreground">Free prizes every week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Donations</p>
                  <p className="text-xs text-muted-foreground">Support verified causes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Payments</p>
                  <p className="text-xs text-muted-foreground">Secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Right side - Login Form Card */}
        <section className="flex items-center justify-center min-h-[580px] lg:min-h-[580px]">
          <div className="w-full max-w-lg lg:max-w-xl">
            <LoginCard />
          </div>
        </section>
        
        {/* Mobile branding - shown on small screens */}
        <section className="lg:hidden py-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
              <span className="font-black text-primary-foreground text-xl">N</span>
            </div>
            <span className="font-black text-xl text-foreground">Nexus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-4">
            Welcome back
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
            Sign in to access events, giveaways, donations, and manage your payments securely.
          </p>
        </section>
      </div>
      
      {/* Footer links */}
      <div className="mt-10 lg:mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-primary">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary underline decoration-primary/30 hover:text-primary/80">
            Create one
          </Link>
        </p>
      </div>
    </div>
  </div>
);
