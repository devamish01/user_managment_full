import type { NavigationItem } from "@/lib/types";

/** Seed data for the mock navigation backend. */
export const mockNavigation: NavigationItem[] = [
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
    id: "nav-payments",
    title: "Payments",
    order: 2,
    visible: true,
    children: [
      { id: "nav-transactions", title: "Transactions", icon: "credit-card", route: "transactions", permission: "pages.transactions", order: 1, visible: true, children: [] },
    ],
  },
  {
    id: "nav-access-control",
    title: "Access Control",
    order: 3,
    visible: true,
    children: [
      { id: "nav-assignment", title: "Role Assignment", icon: "toggle-right", route: "assignment", permission: "pages.assignment", order: 1, visible: true, children: [] },
      { id: "nav-permissions", title: "Permissions", icon: "key", route: "permissions", permission: "pages.permissions", order: 2, visible: true, children: [] },
    ],
  },
  {
    id: "nav-system",
    title: "System",
    order: 4,
    visible: true,
    children: [
      { id: "nav-logs", title: "Activity Logs", icon: "activity", route: "logs", permission: "pages.logs", order: 1, visible: true, children: [] },
      { id: "nav-settings", title: "Settings", icon: "settings", route: "settings", permission: "pages.settings", order: 2, visible: true, children: [] },
      { id: "nav-profile", title: "My Profile", icon: "user", route: "profile", permission: "pages.settings", order: 3, visible: true, children: [] },
    ],
  },
];