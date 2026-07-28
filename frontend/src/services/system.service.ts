/**
 * SystemService — public API for cross-cutting system features
 * (departments, activity logs).
 *
 * Public method signatures are unchanged. Internally delegates to
 * `SystemApi` (the module-level HTTP layer) so the architecture becomes:
 *
 *   Store → SystemService → SystemApi → ApiClient → mockClient
 */

import { SystemApi } from "@/modules/system/api";
import type { GenericQueryParams } from "@/core/api";
import type { ActivityLog } from "@/lib/types";

export class SystemService {
  static getDepartments() {
    return SystemApi.getDepartments();
  }

  static getLogs(params?: GenericQueryParams) {
    return SystemApi.getLogs(params);
  }

  static addLog(log: Omit<ActivityLog, "id" | "timestamp" | "ip">) {
    return SystemApi.addLog(log);
  }
}
