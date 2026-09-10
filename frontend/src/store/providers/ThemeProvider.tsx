import * as React from "react";
import { ThemeMode, ThemeConfig, ThemeCtx } from "../context/ThemeContext";

export const themes: Record<ThemeMode, ThemeConfig> = {
  light: {
    name: "Minimal Light",
    description: "Clean & modern",
    background: "bg-gray-50",
    foreground: "text-gray-900",
    card: "bg-white",
    cardForeground: "text-gray-900",
    muted: "bg-gray-100",
    mutedForeground: "text-gray-500",
    accent: "bg-gray-900",
    accentForeground: "text-white",
    border: "border-gray-200",
    shadow: "shadow-sm",
  },
  "minimal-light": {
    name: "Minimal Light",
    description: "Clean & modern",
    background: "bg-gray-50",
    foreground: "text-gray-900",
    card: "bg-white",
    cardForeground: "text-gray-900",
    muted: "bg-gray-100",
    mutedForeground: "text-gray-500",
    accent: "bg-gray-900",
    accentForeground: "text-white",
    border: "border-gray-200",
    shadow: "shadow-sm",
  },
  dark: {
    name: "Dark Mode",
    description: "Sleek & focused",
    background: "bg-zinc-950",
    foreground: "text-zinc-50",
    card: "bg-zinc-900",
    cardForeground: "text-zinc-50",
    muted: "bg-zinc-800",
    mutedForeground: "text-zinc-400",
    accent: "bg-white",
    accentForeground: "text-zinc-900",
    border: "border-zinc-800",
    shadow: "shadow-lg shadow-black/20",
  },
  retro: {
    name: "Retro Split-Flap",
    description: "Nostalgic vibes",
    background: "bg-amber-50",
    foreground: "text-amber-950",
    card: "bg-amber-100",
    cardForeground: "text-amber-950",
    muted: "bg-amber-100/50",
    mutedForeground: "text-amber-800",
    accent: "bg-amber-900",
    accentForeground: "text-amber-50",
    border: "border-amber-200",
    shadow: "shadow-md shadow-amber-900/10",
  },
  neon: {
    name: "Neon Glow",
    description: "Cyberpunk energy",
    background: "bg-slate-950",
    foreground: "text-cyan-400",
    card: "bg-slate-900",
    cardForeground: "text-cyan-300",
    muted: "bg-slate-800",
    mutedForeground: "text-cyan-500/70",
    accent: "bg-cyan-500",
    accentForeground: "text-slate-950",
    border: "border-cyan-500/30",
    shadow: "shadow-lg shadow-cyan-500/20",
  },
  monochrome: {
    name: "Monochrome",
    description: "Sophisticated tones",
    background: "bg-slate-100",
    foreground: "text-slate-800",
    card: "bg-slate-200",
    cardForeground: "text-slate-900",
    muted: "bg-slate-300/50",
    mutedForeground: "text-slate-600",
    accent: "bg-slate-700",
    accentForeground: "text-slate-50",
    border: "border-slate-300",
    shadow: "shadow-md shadow-slate-400/20",
  },
  glass: {
    name: "Frosted Glass",
    description: "Modern & premium",
    background: "bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100",
    foreground: "text-slate-800",
    card: "bg-white/60 backdrop-blur-xl",
    cardForeground: "text-slate-900",
    muted: "bg-white/40 backdrop-blur-md",
    mutedForeground: "text-slate-600",
    accent: "bg-indigo-500",
    accentForeground: "text-white",
    border: "border-white/50",
    shadow: "shadow-xl shadow-indigo-500/10",
  },
  terminal: {
    name: "Terminal",
    description: "Hacker aesthetic",
    background: "bg-black",
    foreground: "text-green-400",
    card: "bg-green-950/30",
    cardForeground: "text-green-400",
    muted: "bg-green-950/20",
    mutedForeground: "text-green-600",
    accent: "bg-green-500",
    accentForeground: "text-black",
    border: "border-green-900/50",
    shadow: "shadow-lg shadow-green-500/10",
    fontClass: "font-mono",
  },
  luxury: {
    name: "Luxury Gold",
    description: "Premium elegance",
    background: "bg-stone-950",
    foreground: "text-amber-100",
    card: "bg-stone-900",
    cardForeground: "text-amber-200",
    muted: "bg-stone-800",
    mutedForeground: "text-amber-200/60",
    accent: "bg-gradient-to-r from-amber-400 to-yellow-500",
    accentForeground: "text-stone-950",
    border: "border-amber-500/30",
    shadow: "shadow-xl shadow-amber-500/10",
  },
};

export const themeButtons: { mode: ThemeMode; label: string }[] = [
  { mode: "minimal-light", label: "Minimal Light" },
  { mode: "dark", label: "Dark Mode" },
  { mode: "retro", label: "Retro Split-Flap" },
  { mode: "neon", label: "Neon Glow" },
  { mode: "monochrome", label: "Monochrome" },
  { mode: "glass", label: "Frosted Glass" },
  { mode: "terminal", label: "Terminal" },
  { mode: "luxury", label: "Luxury Gold" },
];

export function normalizeThemeMode(theme: ThemeMode): Exclude<ThemeMode, "light"> {
  return theme === "light" ? "minimal-light" : theme;
}

export const themeTokens: Record<ThemeMode, Record<string, string>> = {
  light: {
    background: "0 0% 100%",
    foreground: "222 47% 11%",
    card: "0 0% 100%",
    cardForeground: "222 47% 11%",
    muted: "220 14% 96%",
    mutedForeground: "220 9% 46%",
    accent: "245 75% 58%",
    accentForeground: "0 0% 100%",
    border: "220 13% 91%",
    ring: "245 75% 58%",
    input: "220 13% 91%",
    sidebar: "222 47% 11%",
    sidebarForeground: "220 14% 96%",
  },
  "minimal-light": {
    background: "0 0% 100%",
    foreground: "222 47% 11%",
    card: "0 0% 100%",
    cardForeground: "222 47% 11%",
    muted: "220 14% 96%",
    mutedForeground: "220 9% 46%",
    accent: "245 75% 58%",
    accentForeground: "0 0% 100%",
    border: "220 13% 91%",
    ring: "245 75% 58%",
    input: "220 13% 91%",
    sidebar: "222 47% 11%",
    sidebarForeground: "220 14% 96%",
  },
  dark: {
    background: "222 47% 6%",
    foreground: "210 40% 98%",
    card: "222 47% 9%",
    cardForeground: "210 40% 98%",
    muted: "217 33% 15%",
    mutedForeground: "215 20% 65%",
    accent: "245 82% 67%",
    accentForeground: "222 47% 11%",
    border: "217 33% 18%",
    ring: "245 82% 67%",
    input: "217 33% 18%",
    sidebar: "222 47% 4%",
    sidebarForeground: "210 40% 98%",
  },
  retro: {
    background: "44 90% 95%",
    foreground: "33 45% 18%",
    card: "39 80% 90%",
    cardForeground: "33 45% 18%",
    muted: "39 70% 85%",
    mutedForeground: "28 55% 30%",
    accent: "24 60% 20%",
    accentForeground: "40 95% 90%",
    border: "30 60% 78%",
    ring: "24 60% 20%",
    input: "39 80% 90%",
    sidebar: "25 60% 18%",
    sidebarForeground: "40 95% 90%",
  },
  neon: {
    background: "222 47% 6%",
    foreground: "190 95% 60%",
    card: "220 30% 12%",
    cardForeground: "190 95% 70%",
    muted: "220 20% 18%",
    mutedForeground: "190 80% 70%",
    accent: "190 95% 60%",
    accentForeground: "220 20% 12%",
    border: "190 80% 50%",
    ring: "190 95% 60%",
    input: "220 20% 18%",
    sidebar: "220 20% 8%",
    sidebarForeground: "190 95% 80%",
  },
  monochrome: {
    background: "220 14% 96%",
    foreground: "222 47% 11%",
    card: "220 14% 90%",
    cardForeground: "222 47% 11%",
    muted: "220 14% 85%",
    mutedForeground: "220 9% 46%",
    accent: "220 10% 20%",
    accentForeground: "0 0% 100%",
    border: "220 13% 80%",
    ring: "220 10% 20%",
    input: "220 13% 80%",
    sidebar: "220 14% 14%",
    sidebarForeground: "220 14% 96%",
  },
  glass: {
    background: "248 100% 96%",
    foreground: "222 47% 11%",
    card: "0 0% 100%",
    cardForeground: "222 47% 11%",
    muted: "260 100% 97%",
    mutedForeground: "220 9% 46%",
    accent: "245 75% 58%",
    accentForeground: "0 0% 100%",
    border: "0 0% 100%",
    ring: "245 75% 58%",
    input: "0 0% 100%",
    sidebar: "248 100% 96%",
    sidebarForeground: "222 47% 11%",
  },
  terminal: {
    background: "0 0% 0%",
    foreground: "120 100% 45%",
    card: "120 40% 12%",
    cardForeground: "120 100% 60%",
    muted: "120 30% 10%",
    mutedForeground: "120 80% 60%",
    accent: "120 100% 45%",
    accentForeground: "0 0% 0%",
    border: "120 40% 24%",
    ring: "120 100% 45%",
    input: "120 30% 10%",
    sidebar: "0 0% 0%",
    sidebarForeground: "120 100% 45%",
  },
  luxury: {
    background: "30 13% 7%",
    foreground: "45 90% 90%",
    card: "30 10% 14%",
    cardForeground: "45 90% 90%",
    muted: "30 10% 18%",
    mutedForeground: "45 90% 80%",
    accent: "42 100% 62%",
    accentForeground: "30 12% 8%",
    border: "42 80% 55%",
    ring: "42 100% 62%",
    input: "30 10% 18%",
    sidebar: "30 13% 5%",
    sidebarForeground: "45 90% 90%",
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "minimal-light";
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "minimal-light";
  });

  React.useEffect(() => {
    const root = document.documentElement;
    const normalizedTheme = normalizeThemeMode(theme);
    const palette = themeTokens[normalizedTheme];
    const darkThemeSet = new Set<ThemeMode>(["dark", "neon", "terminal", "luxury"]);

    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value);
    });

    root.classList.toggle("dark", darkThemeSet.has(normalizedTheme));
    root.dataset.theme = normalizedTheme;

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, themes, themeButtons }}>
      {children}
    </ThemeCtx.Provider>
  );
};
export default ThemeProvider;
