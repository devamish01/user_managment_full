/**
 * System module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` for the cross-cutting
 * system endpoints (departments, activity logs, settings).
 * Services delegate here; consumers of `SystemService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse, GenericQueryParams } from "@/core/api";
import type { ActivityLog, Department } from "@/lib/types";
import { DEPARTMENTS, DEPARTMENT_DETAILS, LOGS, SETTINGS } from "./system.endpoints";

export class SystemApi {
  static getDepartments(): Promise<ApiResponse<Department[]>> {
    return api.get<Department[]>(DEPARTMENTS);
  }

  static getDepartmentById(id: string): Promise<ApiResponse<Department>> {
    return api.get<Department>(DEPARTMENT_DETAILS(id));
  }

  static getLogs(params?: GenericQueryParams): Promise<ApiResponse<ActivityLog[]>> {
    return api.get<ActivityLog[]>(LOGS, { params });
  }

  static addLog(
    log: Omit<ActivityLog, "id" | "timestamp" | "ip">,
  ): Promise<ApiResponse<ActivityLog>> {
    return api.post<ActivityLog>(LOGS, log);
  }

  /** Reserved endpoint; no handler is currently registered in the mock backend. */
  static getSettings(): Promise<ApiResponse<unknown>> {
    return api.get<unknown>(SETTINGS);
  }
}
