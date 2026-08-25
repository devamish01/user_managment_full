"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Target, Layers, GitBranch, BarChart3, Code2, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";

const platformValues = [
  {
    icon: Target,
    title: "User-Centric Design",
    description: "Every feature is designed around real user needs — from discovering events to making secure payments.",
  },
  {
    icon: Layers,
    title: "Unified Experience",
    description: "Events, giveaways, donations, and payments — all in one seamless platform with a single account.",
  },
  {
    icon: GitBranch,
    title: "Community First",
    description: "Built to connect people with causes, events, and opportunities that matter to them.",
  },
  {
    icon: BarChart3,
    title: "Transparent Tracking",
    description: "Complete visibility into your transaction history, event participation, and donation impact.",
  },
  {
    icon: Code2,
    title: "Secure by Default",
    description: "Enterprise-grade security for all payments and personal data with modern encryption standards.",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Available worldwide with multi-currency support and localized experiences.",
  },
];

const platformStats = [
  { value: "10K+", label: "Active Users", description: "People using the platform daily" },
  { value: "500+", label: "Events Hosted", description: "Community events and activities" },
  { value: "$1M+", label: "Donations Processed", description: "Funds raised for causes worldwide" },
  { value: "99.9%", label: "Uptime", description: "Reliable platform availability" },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up in minutes with email or social login. Secure, private, and free.",
  },
  {
    step: "02",
    title: "Discover Events & Activities",
    description: "Browse upcoming events, giveaways, and donation campaigns that match your interests.",
  },
  {
    step: "03",
    title: "Participate & Pay Securely",
    description: "Join events, enter giveaways, or donate with our secure payment system.",
  },
  {
    step: "04",
    title: "Track Your Impact",
    description: "View your transaction history, event attendance, and donation receipts in one place.",
  },
];

interface AboutPageProps {
  className?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ className }) => {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-muted">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 animate-fade-in-up">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">About Nexus</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Building a Platform for
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Community & Connection
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Nexus is a user-facing platform where people come together to participate in events, 
            discover giveaways, support causes through donations, and manage their payments — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Button size="lg" className="group w-full sm:w-auto px-8 py-4 text-base" variant="default" asChild>
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-base" variant="outline" asChild>
              <Link to="/events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-28 bg-background" aria-labelledby="mission-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Mission
              </span>
              <h2 id="mission-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Empowering People to Connect,
                <br />
                Participate & Make an Impact
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We believe that participating in community events, supporting causes you care about, 
                and managing your financial transactions should be simple, secure, and transparent.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Nexus was built to remove the friction between people and the experiences they want to be part of. 
                Whether it's attending a local workshop, entering a global giveaway, or donating to a cause 
                halfway across the world — we make it effortless.
              </p>
              <Link to="/events" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
                See What's Happening
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 md:p-12">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
              </div>
              <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {platformStats.map((stat, index) => (
                  <div key={stat.label} className="text-center" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="text-3xl sm:text-4xl font-black text-foreground mb-2">{stat.value}</div>
                    <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-28 bg-muted/30" aria-labelledby="values-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Core Values
            </span>
            <h2 id="values-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Principles That Guide
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Everything We Build
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These aren't just words on a page — they're the lens through which we make every product decision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformValues.map((value, index) => (
              <article
                key={value.title}
                className="group p-6 bg-card border border-border rounded-2xl transition-all hover:shadow-lg hover:border-primary/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-background" aria-labelledby="how-it-works-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 id="how-it-works-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Get Started in
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Four Simple Steps
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From signing up to tracking your impact — we've made every step intuitive.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-10 left-5 right-5 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={step.title} className="relative z-10">
                  <div className="flex flex-col items-center text-center">
                    {/* Step Circle */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background relative z-10">
                        <span className="font-black text-primary text-2xl">{step.step}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-20 lg:py-28 bg-muted/30" aria-labelledby="features-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              What You Can Do
            </span>
            <h2 id="features-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              A Platform Built for
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Your Participation
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover, participate, and track — all from your personal dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="calendar"
              title="Events"
              description="Discover and join upcoming events, workshops, conferences, and community gatherings."
              href="/events"
            />
            <FeatureCard
              icon="gift"
              title="Giveaways"
              description="Enter exciting giveaways with transparent winner selection and instant notifications."
              href="/giveaways"
            />
            <FeatureCard
              icon="heart"
              title="Donations"
              description="Support causes you care about with secure, trackable donations and tax receipts."
              href="/donations"
            />
            <FeatureCard
              icon="credit-card"
              title="Payments & Transactions"
              description="Manage all your payments, view transaction history, and download receipts securely."
              href="/payments"
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">Explore All Activities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/10 to-primary/5 border-y border-primary/20" aria-labelledby="cta-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Create your free account today and start discovering events, participating in giveaways, 
            and making an impact through donations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group w-full sm:w-auto px-8 py-4 text-base" variant="default" asChild>
              <Link to="/register">
                Create Free Account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-base" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* Feature Card Component */
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, href }) => {
  const IconComponent = () => {
    const icons: Record<string, React.ReactNode> = {
      calendar: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
      gift: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>,
      heart: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
      "credit-card": <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>,
    };
    return icons[icon] || icons.calendar;
  };

  return (
    <article className="group p-6 bg-card border border-border rounded-2xl transition-all hover:shadow-lg hover:border-primary/30">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors text-primary">
        <IconComponent />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
      <Link
        to={href}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        Learn more
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
};

export default AboutPage;