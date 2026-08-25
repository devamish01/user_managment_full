"use client";

import React from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";

interface TermsPageProps {
  className?: string;
}

export const TermsPage: React.FC<TermsPageProps> = ({ className }) => {
  const lastUpdated = "January 15, 2025";
  const effectiveDate = "January 15, 2025";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: (
        <div className="space-y-4">
          <p>By accessing and using the Nexus platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement ("Terms of Service"). If you do not agree to abide by the above, please do not use this Service.</p>
          <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
        </div>
      ),
    },
    {
      id: "description",
      title: "2. Description of Service",
      content: (
        <div className="space-y-4">
          <p>Nexus is a user-facing platform that enables users to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Discover and participate in events, workshops, and conferences</li>
            <li>Enter giveaways and contests</li>
            <li>Make donations to causes and campaigns</li>
            <li>Manage payments and view transaction history</li>
            <li>Track participation and impact across all activities</li>
          </ul>
          <p>The Service is provided "as is" and "as available" without warranties of any kind.</p>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "3. User Accounts",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Account Registration</h4>
          <p>To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
          <h4 className="font-semibold text-foreground">Account Security</h4>
          <p>You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          <h4 className="font-semibold text-foreground">Account Termination</h4>
          <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
        </div>
      ),
    },
    {
      id: "events",
      title: "4. Events Participation",
      content: (
        <div className="space-y-4">
          <p>Events on Nexus are created and managed by third-party organizers. Nexus acts as a platform to facilitate discovery and registration.</p>
          <h4 className="font-semibold text-foreground">Registration & Payment</h4>
          <p>Some events may require payment. All payments are processed securely through our payment partners. Refund policies are set by individual event organizers and will be clearly stated on the event page.</p>
          <h4 className="font-semibold text-foreground">Attendance & Conduct</h4>
          <p>By registering for an event, you agree to abide by the organizer's code of conduct. Nexus is not responsible for the content, quality, or safety of third-party events.</p>
        </div>
      ),
    },
    {
      id: "giveaways",
      title: "5. Giveaways & Contests",
      content: (
        <div className="space-y-4">
          <p>Giveaways on Nexus are promotional activities sponsored by third parties. Participation is free and does not require purchase.</p>
          <h4 className="font-semibold text-foreground">Eligibility</h4>
          <p>Giveaways may have geographic, age, or other eligibility restrictions. These will be clearly stated in the giveaway terms.</p>
          <h4 className="font-semibold text-foreground">Winner Selection</h4>
          <p>Winners are selected randomly using a verifiable process. Winners will be notified via email and must respond within the timeframe specified to claim their prize.</p>
          <h4 className="font-semibold text-foreground">Prizes</h4>
          <p>Prizes are provided by sponsors. Nexus is not responsible for prize fulfillment, quality, or delivery.</p>
        </div>
      ),
    },
    {
      id: "donations",
      title: "6. Donations",
      content: (
        <div className="space-y-4">
          <p>Donations made through Nexus are processed securely and forwarded to the designated charitable organizations or campaign organizers.</p>
          <h4 className="font-semibold text-foreground">Tax Receipts</h4>
          <p>For eligible donations, tax receipts will be provided by the receiving organization. Nexus facilitates the transaction but does not issue tax receipts directly.</p>
          <h4 className="font-semibold text-foreground">Refunds</h4>
          <p>Donations are generally non-refundable. If you believe a donation was made in error, contact us within 48 hours and we will attempt to assist.</p>
        </div>
      ),
    },
    {
      id: "payments",
      title: "7. Payments & Transactions",
      content: (
        <div className="space-y-4">
          <p>All payments on Nexus are processed through PCI DSS compliant payment processors (Stripe, PayPal). We do not store full payment card details on our servers.</p>
          <h4 className="font-semibold text-foreground">Transaction History</h4>
          <p>You can view your complete transaction history in your account dashboard, including event registrations, giveaway entries, donations, and any associated fees.</p>
          <h4 className="font-semibold text-foreground">Disputes</h4>
          <p>If you believe a transaction was processed in error, please contact our support team. We will investigate and work with our payment processors to resolve the issue.</p>
        </div>
      ),
    },
    {
      id: "user-content",
      title: "8. User Content & Conduct",
      content: (
        <div className="space-y-4">
          <p>You retain ownership of any content you submit, post, or display on the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the Service.</p>
          <h4 className="font-semibold text-foreground">Prohibited Conduct</h4>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Use the Service for any illegal purpose</li>
            <li>Impersonate any person or entity</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Attempt to gain unauthorized access to any systems</li>
            <li>Transmit viruses, malware, or other harmful code</li>
          </ul>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "9. Intellectual Property",
      content: (
        <div className="space-y-4">
          <p>The Service and its original content (excluding user-provided content), features, and functionality are owned by Nexus and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          <p>Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
        </div>
      ),
    },
    {
      id: "disclaimers",
      title: "10. Disclaimers & Limitation of Liability",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">No Warranties</h4>
          <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
          <h4 className="font-semibold text-foreground">Limitation of Liability</h4>
          <p>In no event shall Nexus, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the Service.</p>
        </div>
      ),
    },
    {
      id: "indemnification",
      title: "11. Indemnification",
      content: (
        <div className="space-y-4">
          <p>You agree to defend, indemnify, and hold harmless Nexus and its licensees and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) resulting from or arising out of your use and access of the Service, or your violation of these Terms.</p>
        </div>
      ),
    },
    {
      id: "governing-law",
      title: "12. Governing Law",
      content: (
        <div className="space-y-4">
          <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
          <p>Any disputes arising under these Terms will be resolved in the state or federal courts located in San Francisco County, California.</p>
        </div>
      ),
    },
    {
      id: "changes",
      title: "13. Changes to Terms",
      content: (
        <div className="space-y-4">
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <p>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "14. Contact Us",
      content: (
        <div className="space-y-4">
          <p>If you have any questions about these Terms, please contact us at:</p>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="font-medium">Nexus Legal Team</p>
            <p>Email: <a href="mailto:legal@nexus.dev" className="text-primary underline">legal@nexus.dev</a></p>
            <p>Address: San Francisco, CA, USA</p>
          </div>
        </div>
      ),
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
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Terms of Service</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Terms of
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Service
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Please read these terms carefully before using our platform. By using Nexus, you agree to these terms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Effective: {effectiveDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-background border-y border-border" aria-labelledby="toc-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="toc-title" className="text-xl font-bold text-foreground mb-6">Table of Contents</h2>
          <nav className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" aria-label="Terms of service sections">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="px-4 py-3 bg-card border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                {section.title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 lg:py-28 bg-background" aria-labelledby="terms-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <article
                key={section.id}
                id={section.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 pb-3 border-b border-border">
                  {section.title}
                </h2>
                <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed">
                  {section.content}
                </div>
              </article>
            ))}
          </div>

          {/* Back to Top */}
          <div className="text-center mt-16 pt-8 border-t border-border">
            <a href="#acceptance" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
              <ArrowRight className="w-4 h-4 -rotate-90" />
              Back to Top
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/10 to-primary/5 border-y border-primary/20" aria-labelledby="cta-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users discovering events, participating in giveaways, and making an impact.
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

export default TermsPage;