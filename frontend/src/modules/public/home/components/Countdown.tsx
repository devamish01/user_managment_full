"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

interface CountdownProps {
  /** Target date for the countdown (ISO string or Date) */
  targetDate: string | Date;
  /** Optional label for the event */
  eventLabel?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show event label */
  showLabel?: boolean;
  /** Callback when countdown reaches zero */
  onComplete?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isComplete: false };
};

const sizeClasses = {
  sm: "text-xs gap-1",
  md: "text-sm gap-2",
  lg: "text-lg gap-3",
};

const numberSizeClasses = {
  sm: "text-2xl font-bold",
  md: "text-3xl font-bold",
  lg: "text-4xl font-bold",
};

const labelSizeClasses = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  eventLabel,
  size = "md",
  showLabel = true,
  onComplete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(new Date(targetDate))
  );

  useEffect(() => {
    const target = new Date(targetDate);
    const initial = calculateTimeRemaining(target);
    setTimeRemaining(initial);

    if (initial.isComplete) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(target);
      setTimeRemaining(remaining);

      if (remaining.isComplete) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const { days, hours, minutes, seconds, isComplete } = timeRemaining;

  const timeUnits = [
    { value: days, label: "Days", key: "days" },
    { value: hours, label: "Hours", key: "hours" },
    { value: minutes, label: "Minutes", key: "minutes" },
    { value: seconds, label: "Seconds", key: "seconds" },
  ];

  return (
    <div className={cn("flex flex-col items-center gap-2", showLabel && eventLabel && "mb-4")}>
      {showLabel && eventLabel && (
        <div className="text-center">
          <p className="font-medium text-foreground">{eventLabel}</p>
          {!isComplete && <p className="text-muted-foreground text-sm">Time Remaining</p>}
          {isComplete && <p className="text-success text-sm font-medium">Event Started!</p>}
        </div>
      )}
      <div
        className={cn(
          "flex items-center gap-1",
          sizeClasses[size]
        )}
        role="timer"
        aria-live="polite"
        aria-label={isComplete ? "Event has started" : `Countdown: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}
      >
        {timeUnits.map(({ value, label, key }) => (
          <div key={key} className="flex flex-col items-center">
            <div
              className={cn(
                "font-mono tabular-nums",
                numberSizeClasses[size],
                isComplete ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className={cn("uppercase tracking-wider", labelSizeClasses[size], "text-muted-foreground")}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;