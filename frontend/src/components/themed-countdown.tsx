"use client";

import { useState, useEffect, useRef } from "react";
import { themes, useTheme } from "@/store";
import { cn } from "@/utils/cn";

interface ThemedCountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function FlipDigit({
  digit,
  theme,
}: {
  digit: string;
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  const themeConfig = themes[theme];
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevDigitRef = useRef(digit);

  useEffect(() => {
    if (prevDigitRef.current !== digit) {
      setPrevious(prevDigitRef.current);
      setCurrent(digit);
      setIsFlipping(true);
      prevDigitRef.current = digit;

      const timeout = window.setTimeout(() => {
        setIsFlipping(false);
      }, 600);

      return () => window.clearTimeout(timeout);
    }
  }, [digit]);

  const cardClass = cn(
    "relative w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 rounded-lg sm:rounded-xl overflow-hidden border flex items-center justify-center text-2xl sm:text-4xl md:text-5xl font-bold transition-all [perspective:300px]",
    themeConfig.card,
    themeConfig.cardForeground,
    themeConfig.border,
    themeConfig.shadow,
    themeConfig.fontClass,
    theme === "glass" && "backdrop-blur-xl bg-white/60",
    theme === "neon" && "shadow-[0_0_20px_rgba(34,211,238,0.3)] border-cyan-500/50",
    theme === "luxury" && "border-amber-500/30",
    theme === "terminal" && "border-green-900/50",
  );

  const halfBg = cn(
    themeConfig.card,
    theme === "glass" && "backdrop-blur-xl bg-white/60",
  );

  return (
    <div className={cardClass}>
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center overflow-hidden border-b z-10",
          themeConfig.border,
          halfBg,
        )}
      >
        <span className="translate-y-1/2 leading-none">{current}</span>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center overflow-hidden",
          halfBg,
        )}
      >
        <span className="-translate-y-1/2 leading-none">
          {isFlipping ? previous : current}
        </span>
      </div>

      {isFlipping && (
        <div
          key={`top-${previous}-${current}`}
          className={cn(
            "absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center overflow-hidden border-b z-30 origin-bottom flip-top",
            themeConfig.border,
            halfBg,
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="translate-y-1/2 leading-none">{previous}</span>
        </div>
      )}

      {isFlipping && (
        <div
          key={`bot-${previous}-${current}`}
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center overflow-hidden z-30 origin-top flip-bottom",
            halfBg,
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="-translate-y-1/2 leading-none">{current}</span>
        </div>
      )}

      <div className={cn("absolute left-0 right-0 top-1/2 h-px -translate-y-px z-40", themeConfig.border)} />
    </div>
  );
}

function FlipUnit({
  value,
  label,
  theme,
}: {
  value: number;
  label: string;
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  const themeConfig = themes[theme];
  const formattedValue = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div className="flex items-center gap-1 sm:gap-2">
        <FlipDigit digit={formattedValue[0]} theme={theme} />
        <FlipDigit digit={formattedValue[1]} theme={theme} />
      </div>
      <span
        className={cn(
          "text-[10px] sm:text-xs uppercase tracking-widest",
          themeConfig.mutedForeground,
          themeConfig.fontClass,
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function ThemedCountdown({ targetDate }: ThemedCountdownProps) {
  const { theme } = useTheme();
  const themeConfig = themes[theme];
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      <FlipUnit value={timeLeft.days} label={theme === "terminal" ? "days" : "Days"} theme={theme} />
      <span
        className={cn(
          "text-2xl sm:text-4xl md:text-5xl font-bold pb-6 sm:pb-8 md:pb-10",
          themeConfig.mutedForeground,
          themeConfig.fontClass,
        )}
      >
        :
      </span>
      <FlipUnit value={timeLeft.hours} label={theme === "terminal" ? "hours" : "Hours"} theme={theme} />
      <span
        className={cn(
          "text-2xl sm:text-4xl md:text-5xl font-bold pb-6 sm:pb-8 md:pb-10",
          themeConfig.mutedForeground,
          themeConfig.fontClass,
        )}
      >
        :
      </span>
      <FlipUnit value={timeLeft.minutes} label={theme === "terminal" ? "mins" : "Minutes"} theme={theme} />
      <span
        className={cn(
          "text-2xl sm:text-4xl md:text-5xl font-bold pb-6 sm:pb-8 md:pb-10",
          themeConfig.mutedForeground,
          themeConfig.fontClass,
        )}
      >
        :
      </span>
      <FlipUnit value={timeLeft.seconds} label={theme === "terminal" ? "secs" : "Seconds"} theme={theme} />
    </div>
  );
}

export default ThemedCountdown;
