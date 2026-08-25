/**
 * Public Module Routes
 *
 * Owns all public-facing URLs that don't require authentication.
 * These routes use the ProtectedPublicLayout wrapper which adapts to auth state.
 */
import type { RouteObject } from "react-router-dom";
import { ProtectedPublicLayout } from "./layouts/ProtectedPublicLayout";
import { AboutPage } from "./about/AboutPage";
import { ContactPage } from "./contact/ContactPage";
import { PrivacyPolicyPage } from "./privacy-policy/PrivacyPolicyPage";
import { TermsPage } from "./terms/TermsPage";
import { LoginPage, RegisterPage } from "@/modules/auth/pages";

/** Public Route Helpers */
export const publicRoutesConfig = {
  home: () => "/home",
  about: () => "/about",
  contact: () => "/contact",
  privacyPolicy: () => "/privacy-policy",
  terms: () => "/terms",
  login: () => "/login",
  register: () => "/register",
};

/** Public Feature Routes — public, no ProtectedRoute wrapper */
export const publicRoutes: RouteObject[] = [
  {
    element: <ProtectedPublicLayout />,
    children: [
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
];

export default publicRoutes;