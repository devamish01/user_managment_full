import type { ApiResponse, RequestConfig } from "./types";
import { apiAdapter } from "./apiAdapter";

/* ==========================================================
 * Generic API Client
 * Mirrors the shape of a real HTTP client (Axios/Fetch).
 * Currently delegates every call to the mockClient.
 * To swap for a real backend later, only this file changes.
 *
 * Part of the core API infrastructure — reusable by every module.
 * ========================================================== */

const buildQueryString = (params?: RequestConfig["params"]): string => {
  if (!params) return "";
  const parts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });
  return parts.length ? `?${parts.join("&")}` : "";
};

const buildUrl = (url: string, config?: RequestConfig): string => {
  return `${url}${buildQueryString(config?.params)}`;
};

class ApiClient {
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return apiAdapter.request<T>("GET", buildUrl(url, config));
  }

  async post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return apiAdapter.request<T>("POST", buildUrl(url, config), body);
  }

  async put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return apiAdapter.request<T>("PUT", buildUrl(url, config), body);
  }

  async patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return apiAdapter.request<T>("PATCH", buildUrl(url, config), body);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return apiAdapter.request<T>("DELETE", buildUrl(url, config));
  }
}

export const api = new ApiClient();
export type { ApiClient };
