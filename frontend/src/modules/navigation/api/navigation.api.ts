/**
 * Navigation module API layer.
 *
 * Thin HTTP wrapper around `core/api/client` that knows only the Navigation
 * endpoint. Services delegate here; consumers of `NavigationService` see no change.
 */

import { api } from "@/core/api";
import type { ApiResponse } from "@/core/api";
import type { NavigationItem } from "@/lib/types";
import { NAVIGATION } from "./navigation.endpoints";

export class NavigationApi {
  static getNavigation(): Promise<ApiResponse<NavigationItem[]>> {
    return api.get<NavigationItem[]>(NAVIGATION);
  }
}
