/**
 * NavigationService — re-exported from the legacy location so the navigation
 * feature module owns its service surface without duplicating API logic.
 *
 * Architecture:
 *   useNavigationStore → NavigationService → NavigationApi → ApiClient → backend
 */
export { NavigationService } from "@/services/navigation.service";
