/**
 * NavigationService — public API for backend-provided application navigation.
 *
 * Public method signatures are unchanged. Internally delegates to
 * `NavigationApi` (the module-level HTTP layer) so the architecture becomes:
 *
 *   Store → NavigationService → NavigationApi → ApiClient → mockClient
 */

import { NavigationApi } from "@/modules/navigation/api";

export class NavigationService {
  static getNavigation() {
    return NavigationApi.getNavigation();
  }
}
