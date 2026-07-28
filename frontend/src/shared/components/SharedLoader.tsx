/**
 * SharedLoader — generic loading indicator.
 * Presentation only. Used for page/section loading states.
 */

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SharedLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export const SharedLoader: React.FC<SharedLoaderProps> = ({
  className,
  size = "md",
  text,
}) => (
  <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeMap[size],
      )}
    />
    {text && <p className="text-sm text-muted-foreground">{text}</p>}
  </div>
);
