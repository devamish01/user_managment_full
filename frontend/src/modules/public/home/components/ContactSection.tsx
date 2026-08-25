"use client";

import React, { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { Mail, MapPin, Phone, MessageSquare, Send, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    items: [
      { label: "General", value: "hello@nexus.dev" },
      { label: "Support", value: "support@nexus.dev" },
      { label: "Sales", value: "sales@nexus.dev" },
      { label: "Security", value: "security@nexus.dev" },
    ],
  },
  {
    icon: MapPin,
    title: "Offices",
    items: [
      { label: "Headquarters", value: "San Francisco, CA" },
      { label: "Europe", value: "London, UK" },
      { label: "Asia Pacific", value: "Singapore" },
    ],
  },
  {
    icon: Phone,
    title: "Phone",
    items: [
      { label: "US Toll-Free", value: "+1 (800) 555-0199" },
      { label: "International", value: "+1 (415) 555-0199" },
    ],
  },
];

interface ContactSectionProps {
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ className }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would be an actual API call
    console.log("Contact form submitted:", formData);
    setStatus("success");
    setFormData({ name: "", email: "", company: "", subject: "", message: "" });

    setTimeout(() => setStatus("idle"), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className={cn("py-20 lg:py-28 bg-muted/30", className)} aria-labelledby="contact-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h2 id="contact-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have questions about Nexus? Our team is here to help. Whether you&apos;re evaluating
            for your team or need enterprise support, we&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {contactInfo.map((section) => (
              <div key={section.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </span>
                      <a
                        href={item.value.includes("@") ? `mailto:${item.value}` : item.value.includes("+") ? `tel:${item.value.replace(/\s/g, "")}` : "#"}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[
                  { href: "https://twitter.com", label: "Twitter", icon: "𝕏" },
                  { href: "https://github.com", label: "GitHub", icon: "⌘" },
                  { href: "https://linkedin.com", label: "LinkedIn", icon: "in" },
                  { href: "https://discord.com", label: "Discord", icon: "💬" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Send Us a Message</h3>

              {status === "success" && (
                <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 text-success flex items-center gap-3 animate-fade-in">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Message Sent Successfully!</p>
                    <p className="text-sm">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@company.com"
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={status === "submitting"}
                      className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & Media</option>
                      <option value="careers">Careers</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project, questions, or how we can help..."
                    disabled={status === "submitting"}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                {" "}and{" "}
                <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                .
              </p>
            </form>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ContactSection;