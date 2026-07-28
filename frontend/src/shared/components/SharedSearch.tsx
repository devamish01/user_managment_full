/**
 * SharedSearch — generic search input with icon.
 * Presentation only. Parent controls the value.
 */

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface SharedSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SharedSearch: React.FC<SharedSearchProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
}) => (
  <div className={cn("relative", className)}>
    <Search
      size={16}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
    />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
      >
        <X size={14} />
      </button>
    )}
  </div>
);
