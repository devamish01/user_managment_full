import React from "react";
import { Dropdown, DropdownItem } from "@/components/ui";

interface PeriodTabsProps {
  period: string;
  onPeriodChange: (period: string) => void;
  onDaysChange: (days: number | undefined) => void;
  onDateRangeChange: (dateRange: { startDate: string; endDate: string }) => void;
  onPageChange: (page: number) => void;
}

export const PeriodTabs: React.FC<PeriodTabsProps> = ({
  period,
  onPeriodChange,
  onDaysChange,
  onDateRangeChange,
  onPageChange,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      {[
        { key: "all", label: "All" },
        { key: "daily", label: "Daily" },
        { key: "weekly", label: "Weekly" },
        { key: "monthly", label: "Monthly" },
        { key: "yearly", label: "Yearly" },
      ].map((t) => (
        <button
          key={t.key}
          onClick={() => {
            onPeriodChange(t.key);
            onDaysChange(undefined);
            onDateRangeChange({ startDate: "", endDate: "" });
            onPageChange(1);
          }}
          className={`px-3 py-1 rounded-md text-sm ${period === t.key ? "bg-primary text-white" : "bg-transparent text-muted-foreground border border-border"}`}
        >
          {t.label}
        </button>
      ))}

      <div>
        <Dropdown
          trigger={<button className="px-3 py-1 rounded-md text-sm bg-transparent border border-border">More</button>}
        >
          {(close) => (
            <>
              {[15, 30, 60, 90, 180].map((n) => (
                <DropdownItem
                  key={n}
                  onClick={() => {
                    onPeriodChange("custom");
                    onDaysChange(n);
                    onDateRangeChange({ startDate: "", endDate: "" });
                    onPageChange(1);
                    close();
                  }}
                >
                  Last {n} days
                </DropdownItem>
              ))}
            </>
          )}
        </Dropdown>
      </div>
    </div>
  </div>
);