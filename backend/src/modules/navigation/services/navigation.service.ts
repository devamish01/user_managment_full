import { Navigation } from "@/modules/navigation/index.js";
import { NAVIGATION_MESSAGES } from "@/modules/navigation/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";
import type { NavigationItem } from "@/modules/navigation/index.js";

export const getNavigation = async (): Promise<NavigationItem[]> => {
  let navigation = await Navigation.findOne().lean();

  if (!navigation) {
    // Initialize with default navigation structure
    const defaultNavigation: NavigationItem[] = [
      {
        id: "nav-overview",
        title: "Overview",
        order: 1,
        visible: true,
        children: [
          { id: "nav-dashboard", title: "Dashboard", icon: "layout-dashboard", route: "dashboard", permission: "pages.dashboard", order: 1, visible: true, children: [] },
          { id: "nav-users", title: "Users List", icon: "users", route: "users", permission: "pages.users", order: 2, visible: true, children: [] },
        ],
      },
      {
        id: "nav-access-control",
        title: "Access Control",
        order: 2,
        visible: true,
        children: [
          { id: "nav-assignment", title: "Role Assignment", icon: "toggle-right", route: "assignment", permission: "pages.assignment", order: 1, visible: true, children: [] },
          { id: "nav-permissions", title: "Permissions", icon: "key", route: "permissions", permission: "pages.permissions", order: 2, visible: true, children: [] },
        ],
      },
      {
        id: "nav-system",
        title: "System",
        order: 3,
        visible: true,
        children: [
          { id: "nav-logs", title: "Activity Logs", icon: "activity", route: "logs", permission: "pages.logs", order: 1, visible: true, children: [] },
          { id: "nav-settings", title: "Settings", icon: "settings", route: "settings", permission: "pages.settings", order: 2, visible: true, children: [] },
          { id: "nav-overview", title: "Overview", icon: "Overview", route: "overview", permission: "pages.overview", order: 3, visible: true, children: [] },

        ],
      },
    ];

    navigation = await Navigation.create({ items: defaultNavigation });
  }

  return navigation.items;
};