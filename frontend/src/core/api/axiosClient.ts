/**
 * Real-backend HTTP client (Axios-based).
 *
 * Mirrors the `request<T>(method, url, body?)` contract used by the mock
 * client so that the ApiAdapter can swap them transparently.
 *
 * - `baseURL` comes from core/config (VITE_API_BASE_URL).
 * - A bearer token is attached automatically when one is stored via
 *   core/auth/token.
 * - Network / HTTP errors are normalised into our `ApiResponse<T>` envelope
 *   so downstream services see the same shape regardless of client.
 */

import axios, { AxiosError, type AxiosInstance } from "axios";
import { config } from "@/core/config";
import { getToken } from "@/core/auth/token";
import { buildResponse } from "./response";
import type { ApiResponse, HttpMethod } from "./types";

const instance: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.set("Authorization", `Bearer ${token}`);
  return cfg;
});

export const axiosClient = {
  async request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await instance.request<ApiResponse<T>>({
        method,
        url,
        data: body,
      });
      // Backend is expected to already speak our ApiResponse<T> envelope.
      return response.data;
    } catch (err) {
      const e = err as AxiosError<ApiResponse<T>>;
      if (e.response?.data) return e.response.data;
      const status = (e.response?.status ?? 500) as ApiResponse<T>["status"];
      return buildResponse<T>(false, status, null, e.message || "Network error");
    }
  },
};

export type AxiosClient = typeof axiosClient;
