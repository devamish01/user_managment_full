"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";

interface PrivacyPolicyPageProps {
  className?: string;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ className }) => {
  const lastUpdated = "January 15, 2025";
  const effectiveDate = "January 15, 2025";

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: (
        <div className="space-y-4">
          <p>Welcome to Nexus ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
          <p>Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.</p>
          <p>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.</p>
        </div>
      ),
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      content: (
        <div className="space-y-4">
          <p>We collect personal information that you voluntarily provide to us when you register on the Site, express an interest in obtaining information about us or our products and services, when you participate in activities on the Site, or otherwise when you contact us.</p>
          <h4 className="font-semibold text-foreground">Personal Information Provided by You</h4>
          <p>We collect names; email addresses; usernames; passwords; contact preferences; contact or authentication data; billing addresses; debit/credit card numbers; and other similar information.</p>
          <h4 className="font-semibold text-foreground">Payment Data</h4>
          <p>We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by our payment processors (Stripe, PayPal), and we do not store full payment details on our servers.</p>
          <h4 className="font-semibold text-foreground">Data Collected Automatically</h4>
          <p>Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Site. This information may be used to connect your device to the Site for analytics and security purposes.</p>
        </div>
      ),
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      content: (
        <div className="space-y-4">
          <p>We use personal information collected via our Site for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>To facilitate account creation and logon process</li>
            <li>To send administrative information to you</li>
            <li>To protect our Services</li>
            <li>To enforce our terms, conditions, and policies</li>
            <li>To respond to legal requests and prevent harm</li>
            <li>To manage events, giveaways, and donations you participate in</li>
            <li>To process payments and provide transaction history</li>
            <li>To send marketing communications (with your consent)</li>
            <li>To improve our platform and user experience</li>
          </ul>
        </div>
      ),
    },
    {
      id: "sharing-information",
      title: "4. Sharing Your Information",
      content: (
        <div className="space-y-4">
          <p>We may share your information in the following situations:</p>
          <h4 className="font-semibold text-foreground">Vendors, Consultants, and Third-Party Service Providers</h4>
          <p>We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: payment processing, data analysis, email delivery, hosting services, customer service, and marketing efforts.</p>
          <h4 className="font-semibold text-foreground">Business Transfers</h4>
          <p>We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>
          <h4 className="font-semibold text-foreground">Legal Obligations</h4>
          <p>We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</p>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "5. Cookies and Tracking Technologies",
      content: (
        <div className="space-y-4">
          <p>We may use cookies, web beacons, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology unless you voluntarily provide it.</p>
          <p>You have the right to accept or reject cookies. Most web browsers are set to accept cookies by default. However, you can usually modify your browser setting to decline cookies if you prefer.</p>
        </div>
      ),
    },
    {
      id: "data-security",
      title: "6. Data Security",
      content: (
        <div className="space-y-4">
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
          <p>We use encryption (HTTPS/TLS) for all data transmission, secure password hashing, and regular security audits. Payment data is handled by PCI DSS compliant payment processors.</p>
        </div>
      ),
    },
    {
      id: "data-retention",
      title: "7. Data Retention",
      content: (
        <div className="space-y-4">
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).</p>
          <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
        </div>
      ),
    },
    {
      id: "your-rights",
      title: "8. Your Privacy Rights",
      content: (
        <div className="space-y-4">
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Access:</strong> You may request access to your personal information.</li>
            <li><strong>Correction:</strong> You may request correction of inaccurate personal information.</li>
            <li><strong>Deletion:</strong> You may request deletion of your personal information.</li>
            <li><strong>Restriction:</strong> You may request restriction of processing of your personal information.</li>
            <li><strong>Portability:</strong> You may request a copy of your personal information in a portable format.</li>
            <li><strong>Objection:</strong> You may object to processing of your personal information.</li>
            <li><strong>Withdraw Consent:</strong> You may withdraw your consent at any time.</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:privacy@nexus.dev" className="text-primary underline">privacy@nexus.dev</a>.</p>
        </div>
      ),
    },
    {
      id: "children",
      title: "9. Children's Privacy",
      content: (
        <div className="space-y-4">
          <p>Our Services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:privacy@nexus.dev" className="text-primary underline">privacy@nexus.dev</a>.</p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "10. Contact Us",
      content: (
        <div className="space-y-4">
          <p>If you have questions or comments about this Privacy Policy, you may contact us at:</p>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="font-medium">Nexus Privacy Team</p>
            <p>Email: <a href="mailto:privacy@nexus.dev" className="text-primary underline">privacy@nexus.dev</a></p>
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
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Privacy Policy</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Your Privacy
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Matters to Us
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            This policy explains how we collect, use, and protect your personal information when you use our platform.
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
          <nav className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" aria-label="Privacy policy sections">
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

      {/* Policy Content */}
      <section className="py-20 lg:py-28 bg-background" aria-labelledby="policy-content">
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
            <a href="#introduction" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
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
            Have Questions About Your Privacy?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            We're here to help. Contact our privacy team for any questions about your data and rights.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Contact Privacy Team</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;