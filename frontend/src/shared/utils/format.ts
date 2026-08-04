/**
 * Generic formatting utilities.
 * Pure functions — no React, no store, no side effects.
 */

import type { BadgeVariant } from "@/shared/types/common";

/** Map a status string to a badge variant for consistent rendering */
export const statusToBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "secondary";
    case "blocked":
      return "destructive";
    case "pending":
      return "warning";
    default:
      return "secondary";
  }
};

/** Mask an email address for privacy-restricted views */
export const maskEmail = (email: string): string =>
  email.replace(/^([^@])(.*)(@.*)$/, (_m, first, _mid, rest) => `${first}***${rest}`);

/** Truncate a string with ellipsis */
export const truncate = (str: string, maxLength: number): string =>
  str.length <= maxLength ? str : `${str.slice(0, maxLength)}…`;

/** Capitalize first letter */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/** Format a number with commas */
export const formatNumber = (n: number): string =>
  n.toLocaleString("en-US");
