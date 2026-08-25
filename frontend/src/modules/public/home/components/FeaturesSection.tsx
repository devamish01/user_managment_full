"use client";

import React from "react";
import {
  Kanban,
  GitMerge,
  Database,
  Monitor,
  Shield,
  Zap,
  Users,
  FileText,
  Settings,
  Smartphone,
  Cloud,
  Lock,
} from "lucide-react";
import { cn } from "@/utils/cn";

const features = [
  // Project Management
  {
    category: "Project Management",
    icon: Kanban,
    items: [
      {
        title: "Agile Boards",
        description: "Customizable Kanban, Scrum, and Scrumban boards with drag-and-drop, swimlanes, and WIP limits.",
      },
      {
        title: "Roadmaps & Planning",
        description: "Visual roadmaps, dependency tracking, capacity planning, and milestone management.",
      },
      {
        title: "Backlog Management",
        description: "Prioritized backlogs, story mapping, estimation poker, and sprint planning tools.",
      },
      {
        title: "Issue Tracking",
        description: "Rich issue templates, custom fields, linked issues, sub-tasks, and bulk operations.",
      },
    ],
  },
  // Development
  {
    category: "Development",
    icon: GitMerge,
    items: [
      {
        title: "Code Repositories",
        description: "Native Git hosting with pull requests, code review, merge strategies, and branch protection.",
      },
      {
        title: "CI/CD Pipelines",
        description: "Visual pipeline builder, parallel execution, matrix builds, and deployment environments.",
      },
      {
        title: "Package Registry",
        description: "Private npm, Docker, Maven, and NuGet registries with vulnerability scanning.",
      },
      {
        title: "Code Search",
        description: "Fast cross-repository code search with semantic understanding and symbol navigation.",
      },
    ],
  },
  // Operations
  {
    category: "Operations",
    icon: Monitor,
    items: [
      {
        title: "Observability",
        description: "Metrics, logs, traces, and real-user monitoring in a unified dashboard.",
      },
      {
        title: "Incident Management",
        description: "On-call scheduling, escalation policies, runbooks, and postmortem templates.",
      },
      {
        title: "Feature Flags",
        description: "Progressive rollouts, targeting rules, experimentation, and kill switches.",
      },
      {
        title: "Infrastructure as Code",
        description: "Terraform, Pulumi, and CloudFormation integration with drift detection.",
      },
    ],
  },
  // Security & Compliance
  {
    category: "Security & Compliance",
    icon: Shield,
    items: [
      {
        title: "Access Control",
        description: "RBAC, ABAC, SSO/SAML/OIDC, SCIM provisioning, and audit logging.",
      },
      {
        title: "Secrets Management",
        description: "Encrypted secrets, rotation policies, dynamic credentials, and vault integration.",
      },
      {
        title: "Compliance Reports",
        description: "SOC 2, ISO 27001, GDPR, HIPAA reports generated automatically.",
      },
      {
        title: "Vulnerability Scanning",
        description: "SAST, DAST, SCA, and container scanning integrated in pipelines.",
      },
    ],
  },
];

interface FeaturesSectionProps {
  className?: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className }) => {
  const [activeCategory, setActiveCategory] = React.useState(0);

  return (
    <section className={cn("py-20 lg:py-28 bg-muted/30", className)} aria-labelledby="features-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Platform Capabilities
          </span>
          <h2 id="features-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Build, Deploy & Operate
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive feature set covering the entire software development lifecycle.
            Pick a category to explore.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Feature categories">
          {features.map((category, index) => (
            <button
              key={category.category}
              role="tab"
              aria-selected={activeCategory === index}
              aria-controls={`panel-${category.category}`}
              id={`tab-${category.category}`}
              onClick={() => setActiveCategory(index)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeCategory === index
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span className="flex items-center gap-2">
                <category.icon className="w-4 h-4" aria-hidden="true" />
                {category.category}
              </span>
            </button>
          ))}
        </div>

        {/* Feature Panels */}
        <div className="relative min-h-[400px]">
          {features.map((category, index) => (
            <div
              key={category.category}
              role="tabpanel"
              id={`panel-${category.category}`}
              aria-labelledby={`tab-${category.category}`}
              hidden={activeCategory !== index}
              className={cn(
                "absolute inset-0 opacity-0 pointer-events-none transition-all duration-300",
                activeCategory === index && "opacity-100 pointer-events-auto relative z-10"
              )}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <article
                    key={item.title}
                    className="group p-6 bg-card border border-border rounded-2xl transition-all hover:shadow-lg hover:border-primary/30"
                    style={{ animationDelay: `${itemIndex * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">More Capabilities</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: "Real-time Sync", desc: "Instant updates across all clients" },
              { icon: Users, title: "Team Workspaces", desc: "Isolated environments per team" },
              { icon: FileText, title: "Documentation", desc: "Integrated wiki and API docs" },
              { icon: Settings, title: "Custom Workflows", desc: "Automation rules and triggers" },
              { icon: Smartphone, title: "Mobile Apps", desc: "Native iOS and Android apps" },
              { icon: Cloud, title: "Multi-cloud Deploy", desc: "AWS, GCP, Azure, Kubernetes" },
              { icon: Lock, title: "Advanced Security", desc: "Zero-trust architecture" },
              { icon: Database, title: "Data Export", desc: "Full data portability" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;