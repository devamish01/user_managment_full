/**
 * navigation.store.ts
 *
 * Navigation feature state ownership.
 * Holds the navigation tree plus a loading flag and an error string.
 *
 * Follows the same hook-based pattern used by users.store.ts /
 * roles.store.ts / permissions.store.ts — no new state management library.
 *
 * Final architecture:
 *   Sidebar → useNavigationStore() → NavigationService → NavigationApi → backend
 */

import * as React from "react";
import type { NavigationItem } from "@/lib/types";
import { NavigationService } from "../services";

export interface NavigationStoreState {
  navigation: NavigationItem[];
  loading: boolean;
  error: string | null;
  getNavigation: () => Promise<void>;
}

export const useNavigationStore = (): NavigationStoreState => {
  const [navigation, setNavigation] = React.useState<NavigationItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getNavigation = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await NavigationService.getNavigation();
      if (res.success && res.data) setNavigation(res.data);
      else setError(res.message || "Failed to load navigation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load navigation");
    } finally {
      setLoading(false);
    }
  }, []);

  return { navigation, loading, error, getNavigation };
};

export default useNavigationStore;
