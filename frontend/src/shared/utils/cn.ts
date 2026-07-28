/**
 * Class name merger utility.
 * Combines clsx + tailwind-merge for conditional class names.
 * Mirrors src/utils/cn.ts — modules will import from here after migration.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
