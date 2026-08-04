import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths, subYears } from "date-fns";

export type PeriodKey =
	| "all_time"
	| "all"
	| "today"
	| "daily"
	| "yesterday"
	| "last_7"
	| "last_30"
	| "last_60"
	| "last_90"
	| "last_180"
	| "this_week"
	| "weekly"
	| "this_month"
	| "monthly"
	| "last_month"
	| "this_year"
	| "yearly"
	| "last_year"
	| "custom";

/**
 * Return ISO start/end for a given period key or custom days.
 * - `period` supports both legacy keys (`last_7`, `last_30`, ...) and
 *   the new API-friendly keys (`all`, `daily`, `weekly`, `monthly`, `yearly`, `custom`).
 * - For `custom`, pass a `days` number to get the last N days (inclusive).
 */
export function getDateRangeFromPeriod(period: string, days?: number): { startDate: string; endDate: string } | null {
	const now = new Date();

	const key = String(period || "").toLowerCase();

	// All / no filter
	if (key === "all" || key === "all_time") return null;

	// Custom days (explicit)
	if (key === "custom") {
		const n = Number(days) || 0;
		if (n <= 0) return null;
		const start = subDays(now, n - 1);
		return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
	}

	switch (key) {
		case "today":
		case "daily":
			return { startDate: startOfDay(now).toISOString(), endDate: endOfDay(now).toISOString() };
		case "yesterday": {
			const d = subDays(now, 1);
			return { startDate: startOfDay(d).toISOString(), endDate: endOfDay(d).toISOString() };
		}
		case "last_7":
			{
				const start = subDays(now, 6);
				return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
			}
		case "last_30":
			{
				const start = subDays(now, 29);
				return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
			}
		case "last_60":
			{
				const start = subDays(now, 59);
				return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
			}
		case "last_90":
			{
				const start = subDays(now, 89);
				return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
			}
		case "last_180":
			{
				const start = subDays(now, 179);
				return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(now).toISOString() };
			}
		case "this_week":
		case "weekly": {
			const start = startOfWeek(now, { weekStartsOn: 1 });
			const end = endOfWeek(now, { weekStartsOn: 1 });
			return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(end).toISOString() };
		}
		case "this_month":
		case "monthly": {
			const start = startOfMonth(now);
			const end = endOfMonth(now);
			return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(end).toISOString() };
		}
		case "last_month": {
			const prev = subMonths(now, 1);
			const start = startOfMonth(prev);
			const end = endOfMonth(prev);
			return { startDate: startOfDay(start).toISOString(), endDate: endOfDay(end).toISOString() };
		}
		case "this_year":
		case "yearly": {
			const start = new Date(now.getFullYear(), 0, 1);
			const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
			return { startDate: start.toISOString(), endDate: end.toISOString() };
		}
		case "last_year": {
			const prev = subYears(now, 1);
			const start = new Date(prev.getFullYear(), 0, 1);
			const end = new Date(prev.getFullYear(), 11, 31, 23, 59, 59, 999);
			return { startDate: start.toISOString(), endDate: end.toISOString() };
		}
		default:
			return null;
	}
}

export default { getDateRangeFromPeriod };
