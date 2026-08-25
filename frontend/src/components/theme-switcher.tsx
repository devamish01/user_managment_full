"use client";

import { themes, type ThemeMode, themeButtons } from "@/store";
import { useTheme } from "@/store";
import { cn } from "@/utils/cn";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const themeConfig = themes[theme];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-2 rounded-full border transition-all",
        themeConfig.muted,
        themeConfig.border,
        theme === "glass" && "backdrop-blur-xl bg-white/60",
        theme === "neon" && "shadow-[0_0_15px_rgba(34,211,238,0.2)]",
      )}
    >
      {themeButtons.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
            theme === mode
              ? cn(themeConfig.accent, themeConfig.accentForeground, "shadow-md")
              : cn(themeConfig.mutedForeground, "hover:bg-opacity-80"),
            theme === "neon" && theme === mode && "shadow-[0_0_15px_rgba(34,211,238,0.5)]",
            theme === "luxury" && theme === mode && "shadow-[0_0_15px_rgba(251,191,36,0.4)]",
            themeConfig.fontClass,
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}