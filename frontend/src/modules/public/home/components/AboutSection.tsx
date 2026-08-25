"use client";

import React from "react";
import { Target, Layers, GitBranch, BarChart3, Code2, Globe, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const platformValues = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "Every feature is designed to solve real problems for development teams, not just check boxes.",
  },
  {
    icon: Layers,
    title: "Unified Workflow",
    description: "Planning, development, deployment, and monitoring — all connected in a single seamless experience.",
  },
  {
    icon: GitBranch,
    title: "Developer First",
    description: "Built by developers, for developers. Intuitive APIs, excellent DX, and powerful customization.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description: "Real-time analytics, custom dashboards, and actionable insights to improve team velocity.",
  },
  {
    icon: Code2,
    title: "Extensible by Design",
    description: "Plugin architecture, webhooks, and open APIs let you tailor the platform to your unique needs.",
  },
  {
    icon: Globe,
    title: "Global Collaboration",
    description: "Multi-language support, regional compliance, and distributed team workflows out of the box.",
  },
];

const platformStats = [
  { value: "40%", label: "Faster Delivery", description: "Average improvement in deployment frequency" },
  { value: "60%", label: "Fewer Bugs", description: "Reduction in production incidents reported" },
  { value: "3x", label: "Team Velocity", description: "Increase in feature throughput after adoption" },
  { value: "99.9%", label: "Uptime", description: "Enterprise-grade SLA with global redundancy" },
];

interface AboutSectionProps {
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ className }) => {
  return (
    <section className={cn("py-20 lg:py-28 bg-background", className)} aria-labelledby="about-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            What is Nexus?
          </span>
          <h2 id="about-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Unified Platform for
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Modern Engineering Teams
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nexus combines project management, CI/CD, observability, and team collaboration into a single platform.
            Eliminate tool sprawl, reduce context switching, and ship better software faster.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

        {/* Impact Stats */}
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 md:p-12 mb-16">
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
              Measurable Impact for Teams
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {platformStats.map((stat, index) => (
                <div key={stat.label} className="text-center relative">
                  <div className="relative">
                    <div className="text-4xl sm:text-5xl font-black text-foreground mb-2">
                      {stat.value}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-1">{stat.label}</h4>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                  {index < platformStats.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-1/2 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
            How It Works
          </h3>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Connect Your Tools",
                  description:
                    "Integrate with GitHub, GitLab, Jira, Slack, and 150+ tools in minutes. No complex setup required.",
                  icon: GitBranch,
                },
                {
                  step: "02",
                  title: "Automate Workflows",
                  description:
                    "Create custom pipelines for CI/CD, code review, deployments, and releases with visual workflow builder.",
                  icon: Layers,
                },
                {
                  step: "03",
                  title: "Collaborate in Context",
                  description:
                    "Discuss code, review changes, and make decisions without leaving your workflow. Context preserved automatically.",
                  icon: Code2,
                },
                {
                  step: "04",
                  title: "Measure & Improve",
                  description:
                    "Track DORA metrics, cycle time, deployment frequency, and team health. Get actionable insights to improve.",
                  icon: BarChart3,
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="relative lg:pl-[55%] lg:pr-8"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute left-1/2 lg:left-auto lg:right-[calc(50%+2rem)] top-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg z-10">
                    {item.step}
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">{item.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;