/**
 * System module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` for the cross-cutting
 * system endpoints ( activity logs, settings).
 * Services delegate here; consumers of `SystemService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse, GenericQueryParams } from "@/core/api";
import type { ActivityLog,  } from "@/lib/types";
import {  LOGS, SETTINGS } from "./system.endpoints";

export class SystemApi {


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
