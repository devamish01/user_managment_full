import { useState } from "react";
import { Calendar, Clock, CalendarDays } from "lucide-react";

type Period = "all" | "upcoming" | "ongoing" | "past";

interface PeriodTabsProps {
  activePeriod: Period;
  onPeriodChange: (period: Period) => void;
  counts?: Record<Period, number>;
}

const periods: { value: Period; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "all", label: "All", icon: Calendar },
  { value: "upcoming", label: "Upcoming", icon: CalendarDays },
  { value: "ongoing", label: "Ongoing", icon: Clock },
  { value: "past", label: "Past", icon: Calendar },
];

export function PeriodTabs({ activePeriod, onPeriodChange, counts }: PeriodTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {periods.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onPeriodChange(value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activePeriod === value
              ? "bg-primary-100 text-primary-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
          {counts && counts[value] !== undefined && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activePeriod === value ? "bg-primary-200 text-primary-800" : "bg-gray-200 text-gray-700"
            }`}>
              {counts[value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}