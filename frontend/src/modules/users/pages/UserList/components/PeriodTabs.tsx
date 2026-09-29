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
  <div className="users-period-tabs">
    <div className="flex flex-wrap items-center gap-2">
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
          className={`shrink-0 px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${period === t.key ? "bg-primary text-white" : "bg-transparent text-muted-foreground border border-border"}`}
        >
          {t.label}
        </button>
      ))}

      <div className="shrink-0">
        <Dropdown
          trigger={<button className="shrink-0 px-3 py-1.5 rounded-md text-sm whitespace-nowrap bg-transparent border border-border">More</button>}
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