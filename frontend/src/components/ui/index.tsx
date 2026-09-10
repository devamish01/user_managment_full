import * as React from "react";
import { cn } from "@/utils/cn";
import { Check, ChevronDown, X } from "lucide-react";

/* ---------- Button ---------- */
type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "secondary" | "subtle";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }
>(({ className, variant = "default", size = "md", ...props }, ref) => {
  const variants: Record<ButtonVariant, string> = {
    default:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
    outline:
      "border border-border bg-transparent hover:bg-accent text-foreground",
    ghost: "hover:bg-accent text-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    subtle: "bg-primary/10 text-primary hover:bg-primary/15",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-9 px-4 text-sm rounded-lg",
    lg: "h-11 px-6 text-sm rounded-lg",
    icon: "h-9 w-9 rounded-lg",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

/* ---------- Input ---------- */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

/* ---------- Textarea ---------- */
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/* ---------- Label ---------- */
export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("text-sm font-medium text-foreground leading-none", className)}
    {...props}
  />
);

/* ---------- Card ---------- */
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
);
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

/* ---------- Badge ---------- */
type BadgeVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
export const Badge = ({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }) => {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    outline: "border-border text-foreground",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};

/* ---------- Switch ---------- */
export const Switch = ({
  checked,
  onCheckedChange,
  disabled,
  className,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
}) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-primary" : "bg-input",
      className,
    )}
  >
    <span
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform",
        checked ? "translate-x-4" : "translate-x-0",
      )}
    />
  </button>
);

/* ---------- Avatar ---------- */
export const Avatar = ({
  src,
  name,
  size = 36,
  className,
}: { src?: string; name?: string; size?: number; className?: string }) => {
  const [error, setError] = React.useState(false);
  const safeName = (name || "").trim();
  const initials = safeName
    ? safeName
        .split(" ")
        .map((n) => (n ? n[0] : ""))
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";
  const colors = [
    "from-indigo-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-pink-500",
    "from-fuchsia-500 to-rose-500",
    "from-sky-500 to-indigo-500",
  ];
  const idx = safeName ? safeName.charCodeAt(0) % colors.length : 0;
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white ring-2 ring-background",
        colors[idx],
        className,
      )}
    >
      {src && !error ? (
        <img
          src={src}
          alt={name}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

/* ---------- Modal / Dialog ---------- */
export const Dialog = ({
  open,
  onClose,
  children,
  className,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  React.useEffect(() => {
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
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in",
          sizes[size],
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
};

/* ---------- Drawer (right side) ---------- */
export const Drawer = ({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-card shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

/* ---------- Select ---------- */
export const Select = ({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const current = options.find((o) => o.value === value);
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={current ? "" : "text-muted-foreground"}>
          {current?.label || placeholder || "Select..."}
        </span>
        <ChevronDown size={14} className="opacity-60" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg animate-in">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                  opt.value === value && "bg-accent font-medium",
                )}
              >
                <span>{opt.label}</span>
                {opt.value === value && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Dropdown Menu ---------- */
export const Dropdown = ({
  trigger,
  children,
  align = "right",
  className,
}: {
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-[70] mt-1 min-w-[180px] rounded-lg border border-border bg-popover p-1 shadow-lg animate-in",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
};
export const DropdownItem = ({
  className,
  destructive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { destructive?: boolean }) => (
  <button
    className={cn(
      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
      destructive && "text-red-600 hover:bg-red-500/10 hover:text-red-600",
      className,
    )}
    {...props}
  />
);

/* ---------- Skeleton ---------- */
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("skeleton rounded-md", className)} />
);

/* ---------- Tabs ---------- */
export const Tabs = ({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
    {tabs.map((t) => (
      <button
        key={t.value}
        onClick={() => onChange(t.value)}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
          value === t.value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t.icon}
        {t.label}
      </button>
    ))}
  </div>
);
