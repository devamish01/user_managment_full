"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, MessageSquare, Send, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { cn } from "@/utils/cn";

interface ContactPageProps {
  className?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ className }) => {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "We typically respond within 24 hours",
      action: "hello@nexus.dev",
      href: "mailto:hello@nexus.dev",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters location",
      action: "San Francisco, CA",
      href: "https://maps.google.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri, 9am-6pm PST",
      action: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MessageSquare,
      title: "Community",
      description: "Join our Discord community",
      action: "discord.gg/nexus",
      href: "https://discord.gg/nexus",
    },
  ];

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
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Contact Us</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Get in Touch
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Have questions about events, giveaways, donations, or payments? 
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Choose the best way to reach us. We're here to help with any questions about our platform.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={item.title} className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        <item.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <a
                          href={item.href}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 mt-2 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.action}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all" aria-label="GitHub">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all" aria-label="LinkedIn">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all" aria-label="Discord">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.067.067 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-.214.076.076 0 0 0 .041-.106 13.107 13.107 0 0 0-.865-6.482.057.057 0 0 1-.007-.076 3.882 3.882 0 0 1 1.463-2.567.07.07 0 0 1 .106-.017c1.176.32 2.333.678 3.472 1.073a.07.07 0 0 1 .107.017 3.778 3.778 0 0 1 1.463 2.567.057.057 0 0 1-.006.076 13.28 13.28 0 0 0-.865 6.482.077.077 0 0 0 .04.106c.36.064.723.11 1.087.154a.076.076 0 0 0 .085-.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.41-4.369-.443-8.887-1.589-13.55a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all" aria-label="YouTube">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12 9.545 15.568z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
                  <p className="text-muted-foreground mt-2">Fill out the form below and we'll get back to you within 24 hours.</p>
                </CardHeader>
                <CardContent>
                  {status === "success" ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 animate-fade-in-up">
                      <CheckCircle className="w-6 h-6 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Message Sent Successfully!</p>
                        <p className="text-sm">Thank you for reaching out. We'll get back to you soon.</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setStatus("idle")}>
                        Send Another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            disabled={status === "submitting"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            disabled={status === "submitting"}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <select
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                          disabled={status === "submitting"}
                          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select a topic</option>
                          <option value="events">Events & Workshops</option>
                          <option value="giveaways">Giveaways</option>
                          <option value="donations">Donations & Causes</option>
                          <option value="payments">Payments & Transactions</option>
                          <option value="technical">Technical Support</option>
                          <option value="partnership">Partnership Inquiry</option>
                          <option value="press">Press & Media</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help..."
                          rows={6}
                          required
                          disabled={status === "submitting"}
                        />
                      </div>

                      <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={status === "submitting"}>
                        {status === "submitting" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By submitting this form, you agree to our{" "}
                        <Link to="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>
                        {" and "}
                        <Link to="/terms" className="underline hover:text-primary">Terms of Service</Link>
                        .
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-muted/30" aria-labelledby="faq-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="faq-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Frequently Asked
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Quick answers to common questions. Can't find what you're looking for?
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Click 'Get Started' on the homepage or navigate to /register. You can sign up with your email address or use social login options. It's free and takes less than a minute.",
  },
  {
    question: "How do I join an event?",
    answer: "Browse events on the Events page, click on an event you're interested in, and click 'Register' or 'Join'. Some events may require payment, which you can complete securely through our platform.",
  },
  {
    question: "Are giveaways free to enter?",
    answer: "Yes, all giveaways on Nexus are free to enter. Simply click 'Enter' on any active giveaway. Winners are selected randomly and notified via email.",
  },
  {
    question: "How do donations work?",
    answer: "Browse active donation campaigns on the Donations page. Choose a cause, select an amount (or enter a custom amount), and complete the payment. You'll receive a receipt for tax purposes.",
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. We use industry-standard encryption and partner with trusted payment processors. We never store your full payment details on our servers.",
  },
  {
    question: "Can I get a refund for an event?",
    answer: "Refund policies vary by event organizer. Check the event details page for specific refund information. For paid events, contact the organizer directly through the event page.",
  },
];

const FAQItem: React.FC<{ faq: { question: string; answer: string } }> = ({ faq }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground pr-4">{faq.question}</span>
        <svg
          className={cn("w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn("overflow-hidden transition-all duration-300", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}
      >
        <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;