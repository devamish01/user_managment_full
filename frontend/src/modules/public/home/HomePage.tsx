"use client";

import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, ArrowRight, Users, Target, TrendingUp, Shield, Sparkles, Lock, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { cn } from "@/utils/cn";
import { Countdown } from "./components/Countdown";
// import { ThemedCountdown } from "@/components/themed-countdown";

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Payments & Transactions",
      description: "Secure, fast payments with full transaction history. Send, receive, and track all your payments in one place.",
      link: "/login",
      color: "bg-green-500/10 text-green-600",
      iconColor: "text-green-600",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Enterprise-grade security with encryption, 2FA, and privacy controls. Your data stays yours.",
      link: "/about",
      color: "bg-blue-500/10 text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "Lightning-fast transfers between users. No waiting, no hidden fees, just instant payments.",
      link: "/login",
      color: "bg-yellow-500/10 text-yellow-600",
      iconColor: "text-yellow-600",
    },
    {
      icon: Shield,
      title: "Full History & Reports",
      description: "Complete transaction history with detailed reports, filters, and export options for accounting.",
      link: "/login",
      color: "bg-purple-500/10 text-purple-600",
      iconColor: "text-purple-600",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in seconds with email. Your secure profile unlocks personalized payment features.",
    },
    {
      number: "02",
      title: "Verify Your Identity",
      description: "Complete quick KYC verification for enhanced security and higher transaction limits.",
    },
    {
      number: "03",
      title: "Add Payment Methods",
      description: "Link your bank account, cards, or wallet. Multiple payment options for flexibility.",
    },
    {
      number: "04",
      title: "Start Transacting",
      description: "Send, receive, and manage payments instantly. Track everything in your dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-muted">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 animate-fade-in-up">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Welcome to Nexus</span>
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                Your Secure Payment Platform
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Fast, Safe & Transparent
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                Send, receive, and manage payments with confidence. Enterprise-grade security, 
                instant transfers, and complete transaction history — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
                  <Link to="/login">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" asChild>
                  <Link to="/about">
                    Learn More
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>10K+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>1M+ Transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>$100M+ Processed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>100% Secure</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-12 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <Clock className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">Next Feature Launch:</span>
                  <Countdown 
                    targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()} 
                    size="md"
                    showLabel={true}
                  />
                </div>
              </div>

              {/* Themed Countdown */}
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Launch Countdown</p>
                  {/* <ThemedCountdown 
                    targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} 
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Can Do */}
        <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="features-title" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                What You Can Do on Nexus
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Four powerful features for seamless payments
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={feature.title} className="group h-full transition-all hover:shadow-xl hover:border-primary/30">
                  <CardHeader>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.color)}>
                      <feature.icon className={cn("w-6 h-6", feature.iconColor)} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link to={feature.link}>
                        Explore {feature.title}
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-background" aria-labelledby="how-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="how-title" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in four simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative text-center">
                  <div className="text-4xl font-black text-primary/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 right-[-20%] w-[40%] h-0.5 bg-gradient-to-r from-primary/20 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Platform */}
        <section className="py-16 lg:py-24 bg-background" aria-labelledby="about-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="about-title" className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  About Nexus Platform
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Nexus is a modern payment platform designed for individuals and businesses 
                  who value speed, security, and transparency. We believe that moving money 
                  should be as simple as sending a message.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Whether you're splitting bills with friends, paying for services, or managing 
                  business transactions — Nexus makes it simple, secure, and instant.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Free to join — no monthly fees",
                    "Instant peer-to-peer transfers",
                    "Bank-grade encryption & security",
                    "Complete transaction history & reports",
                    "Multi-currency support",
                    "Mobile-friendly — access anywhere, anytime",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">Learn More About Us <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Join?</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Create your free account and start sending payments instantly.
                    </p>
                    <Button size="lg" asChild>
                      <Link to="/login">Get Started Free</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 to-primary/5 border-y border-primary/20" aria-labelledby="contact-cta-title">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="contact-cta-title" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Have Questions or Want to Partner?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you. Whether you're a business looking to integrate payments, 
              a developer building on our platform, or just have questions — let's connect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="default" asChild>
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;