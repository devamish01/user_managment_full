"use client";

import React from "react";
import { Button } from "@/components/ui";
import { ArrowRight, CheckCircle, Star, Rocket, Users, Globe } from "lucide-react";
import { cn } from "@/utils/cn";

const benefits = [
  { icon: CheckCircle, text: "Free 14-day trial, no credit card required" },
  { icon: CheckCircle, text: "Unlimited projects and team members" },
  { icon: CheckCircle, text: "Full access to all features" },
  { icon: CheckCircle, text: "24/7 support during trial" },
  { icon: CheckCircle, text: "Cancel anytime, export your data" },
];

const trustBadges = [
  { icon: Star, label: "4.9/5", text: "Customer Satisfaction" },
  { icon: Rocket, label: "99.9%", text: "Uptime Guarantee" },
  { icon: Users, label: "10K+", text: "Active Teams" },
  { icon: Globe, label: "50+", text: "Countries Served" },
];

interface CTASectionProps {
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ className }) => {
  return (
    <section className={cn("py-20 lg:py-28 bg-background", className)} aria-labelledby="cta-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-8 md:p-16 lg:p-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/5"
                style={{
                  width: `${40 + i * 15}px`,
                  height: `${40 + i * 15}px`,
                  top: `${10 + i * 15}%`,
                  left: `${5 + i * 18}%`,
                  animation: `float ${8 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur">
                Ready to transform your workflow?
              </span>
              <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Building Better Products Today
              </h2>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Join thousands of teams already using Nexus to ship faster, collaborate better,
                and scale with confidence. Get started in minutes.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.text}
                  className="flex items-start gap-3 text-white/90"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                    <benefit.icon className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="group w-full sm:w-auto px-8 py-4 text-base bg-white text-primary hover:bg-white/90 shadow-xl"
                variant="default"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-base border-white text-white hover:bg-white/10"
                variant="outline"
              >
                Schedule a Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-white/20">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <badge.icon className="w-5 h-5 text-white/80" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-black text-white">{badge.label}</div>
                    <div className="text-sm text-white/70">{badge.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(15px, -15px) rotate(90deg); }
              50% { transform: translate(-10px, 15px) rotate(180deg); }
              75% { transform: translate(-15px, -10px) rotate(270deg); }
            }
          `}</style>
        </div>

        {/* Alternative CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in to your dashboard
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            Questions?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact our team
            </a>
            {" "}or check our{" "}
            <a href="/docs" className="text-primary hover:underline font-medium">
              documentation
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;