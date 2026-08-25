/**
 * LoginHeader — modern masthead for the sign-in surface.
 *
 * Matches the home page design language with gradient backgrounds,
 * animated elements, and consistent theme colors.
 */

import * as React from "react";
import { Sparkles, Calendar, Gift, Heart, CreditCard, Shield, Users, Zap } from "lucide-react";
import { cn } from "@/utils/cn";

export interface LoginHeaderProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  kicker = "Welcome to Nexus",
  title = "Sign in to your account",
  subtitle = "Access events, giveaways, donations, and manage your payments securely.",
}) => (
  <header className={cn(
    "relative flex h-full flex-col justify-center items-center gap-10 p-8 sm:p-12",
    "bg-gradient-to-br from-background via-background to-muted",
    "overflow-hidden"
  )}>
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
    </div>

    {/* Floating geometric shapes */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/10 blur-xl"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>

    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(10px) translateX(-15px); }
        75% { transform: translateY(-15px) translateX(5px); }
      }
    `}</style>

    <div className="relative z-10 max-w-2xl w-full text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 animate-fade-in-up">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Sign In</span>
      </div>

      {/* Brand */}
      <div className="flex items-center gap-3 justify-center mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
          <span className="font-black text-primary-foreground text-xl">N</span>
        </div>
        <span className="font-black text-xl text-foreground">Nexus</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        {title}
      </h1>

      {/* Subheadline */}
      <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        {subtitle}
      </p>

      {/* Feature highlights - matching HomePage What You Can Do */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Events</p>
            <p className="text-xs text-muted-foreground">Workshops, conferences, meetups</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Giveaways</p>
            <p className="text-xs text-muted-foreground">Free prizes every week</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Donations</p>
            <p className="text-xs text-muted-foreground">Support verified causes</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Payments</p>
            <p className="text-xs text-muted-foreground">Secure transactions</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);
