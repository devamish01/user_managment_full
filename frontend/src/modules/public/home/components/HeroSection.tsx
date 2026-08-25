"use client";

import React from "react";
import { Button } from "@/components/ui";
import { ArrowRight, Sparkles, Zap, Shield, Users, Globe } from "lucide-react";
import { cn } from "@/utils/cn";

const features = [
  {
    icon: Sparkles,
    title: "Modern Tech Stack",
    description: "Built with React 18, TypeScript, Vite, and Tailwind CSS for optimal performance and developer experience.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized bundle splitting, lazy loading, and caching strategies ensure sub-second page loads.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access control, JWT authentication, audit logging, and compliance-ready architecture.",
  },
  {
    icon: Users,
    title: "Collaborative Workflows",
    description: "Real-time collaboration, comments, approvals, and granular permissions for team productivity.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Multi-region deployment, CDN integration, and horizontal scaling for worldwide availability.",
  },
  {
    icon: ArrowRight,
    title: "Extensible Platform",
    description: "Plugin architecture, webhooks, and comprehensive APIs for custom integrations and extensions.",
  },
];

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section
      className={cn(
        "relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted",
        className
      )}
      aria-labelledby="hero-title"
    >
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 animate-fade-in-up">
          <span className="text-xs font-medium uppercase tracking-wider">New Release v2.0</span>
          <span className="relative h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1
          id="hero-title"
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          Build Better Products
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Faster, Together
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          The unified platform for modern teams to plan, build, and ship software with confidence.
          From idea to production — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <Button size="lg" className="group w-full sm:w-auto px-8 py-4 text-base" variant="default">
            Get Started Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-base" variant="outline">
            Watch Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <p className="text-sm text-muted-foreground mb-4">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <span className="font-medium text-foreground">Acme Corp</span>
            <span className="font-medium text-foreground">TechStart</span>
            <span className="font-medium text-foreground">GlobalTech</span>
            <span className="font-medium text-foreground">InnovateLabs</span>
            <span className="font-medium text-foreground">FutureSystems</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-foreground">10K+</div>
            <div className="text-sm text-muted-foreground mt-1">Active Teams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-foreground">50M+</div>
            <div className="text-sm text-muted-foreground mt-1">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-foreground">99.9%</div>
            <div className="text-sm text-muted-foreground mt-1">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-foreground">150+</div>
            <div className="text-sm text-muted-foreground mt-1">Integrations</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(90deg); }
          50% { transform: translate(-10px, 20px) rotate(180deg); }
          75% { transform: translate(-20px, -10px) rotate(270deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;