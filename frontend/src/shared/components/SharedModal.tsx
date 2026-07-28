/**
 * SharedModal — generic dialog/modal overlay.
 * Presentation only. Handles open/close and escape key.
 */

import React, { useEffect } from "react";
import { cn } from "@/shared/utils/cn";
import { X } from "lucide-react";

export interface SharedModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  title?: string;
}

const sizeMap = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

export const SharedModal: React.FC<SharedModalProps> = ({
  open,
  onClose,
  children,
  className,
  size = "md",
  title,
}) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in", sizeMap[size], className)}>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-accent">
          <X size={16} />
        </button>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};
