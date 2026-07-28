/**
 * API Adapter.
 *
 * Single switching point between the in-memory mock client and the real
 * Axios-based backend client. Decision is driven entirely by
 * `core/config` (i.e. VITE_API_MODE).
 *
 * Feature modules and services never see this branching — they keep calling
 * `api.get/post/...` as before.
 */

import { config } from "@/core/config";
import { mockClient } from "@/core/mock";
import { axiosClient } from "./axiosClient";
import type { ApiResponse, HttpMethod } from "./types";

export const apiAdapter = {
  /** Active mode resolved from the environment, exposed for diagnostics. */
  get mode() {
    return config.apiMode;
  },

  request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    if (config.apiMode === "backend") {
      return axiosClient.request<T>(method, url, body);
    }
    return mockClient.request<T>(method, url, body);
  },
};

export type ApiAdapter = typeof apiAdapter;
