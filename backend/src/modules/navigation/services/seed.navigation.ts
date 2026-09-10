import { Navigation } from "@/modules/navigation/index.js";
import type { NavigationItem } from "@/modules/navigation/index.js";

/** Default navigation structure matching frontend mock */
export const DEFAULT_NAVIGATION: NavigationItem[] = [
  {
    id: "nav-home",
    title: "Home",
    order: 0,
    visible: true,
    icon: "home",
    route: "home",
    permission: "home.view",
    children: [],
  },
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
    id: "nav-events",
    title: "Events",
    order: 3,
    visible: true,
    children: [
      { id: "nav-events-list", title: "Events", icon: "calendar", route: "events", permission: "pages.events", order: 1, visible: true, children: [] },
    ],
  },
  {
    id: "nav-access-control",
    title: "Access Control",
    order: 4,
    visible: true,
    children: [
      { id: "nav-assignment", title: "Role Assignment", icon: "toggle-right", route: "assignment", permission: "pages.assignment", order: 1, visible: true, children: [] },
      { id: "nav-permissions", title: "Permissions", icon: "key", route: "permissions", permission: "pages.permissions", order: 2, visible: true, children: [] },
    ],
  },
  {
    id: "nav-system",
    title: "System",
    order: 5,
    visible: true,
    children: [
      { id: "nav-logs", title: "Activity Logs", icon: "activity", route: "logs", permission: "pages.logs", order: 1, visible: true, children: [] },
      { id: "nav-settings", title: "Settings", icon: "settings", route: "settings", permission: "pages.settings", order: 2, visible: true, children: [] },
      { id: "nav-profile", title: "My Profile", icon: "user", route: "profile", permission: "pages.settings", order: 3, visible: true, children: [] },
    ],
  },
];

/** Flatten navigation tree into a flat array of items (preserving children structure for each) */
const flattenNavigation = (items: NavigationItem[]): NavigationItem[] => {
  const result: NavigationItem[] = [];
  for (const item of items) {
    // Add the item with its children intact
    result.push({ ...item });
    if (item.children && item.children.length > 0) {
      result.push(...flattenNavigation(item.children));
    }
  }
  return result;
};

/** Sync a single navigation item into the items array */
const syncNavigationItem = (
  items: NavigationItem[],
  newItem: NavigationItem
): { items: NavigationItem[]; created: boolean; updated: boolean } => {
  const existingIndex = items.findIndex((item) => item.id === newItem.id);
  
  if (existingIndex >= 0) {
    // Item exists - update it
    const updatedItems = [...items];
    updatedItems[existingIndex] = { ...newItem };
    return { items: updatedItems, created: false, updated: true };
  } else {
    // Item doesn't exist - add it
    const updatedItems = [...items, newItem];
    return { items: updatedItems, created: true, updated: false };
  }
};

/** Seed navigation with default structure using idempotent sync (same pattern as seedPermissions) */
export const seedNavigation = async (): Promise<void> => {
  console.log("Seeding default navigation (idempotent)...");

  // Flatten the navigation tree to process each item individually
  const flatNavigation = flattenNavigation(DEFAULT_NAVIGATION);

  // Get or create the navigation document
  let navigation = await Navigation.findOne().lean();
  
  if (!navigation) {
    // No navigation document exists - create with all default items
    navigation = await Navigation.create({ items: DEFAULT_NAVIGATION });
    console.log(`Navigation: ${flatNavigation.length} created, 0 updated, ${flatNavigation.length} total`);
    return;
  }

  // Navigation document exists - sync each item
  let currentItems = navigation.items;
  let createdCount = 0;
  let updatedCount = 0;

  for (const item of flatNavigation) {
    const result = syncNavigationItem(currentItems, item);
    currentItems = result.items;
    if (result.created) createdCount++;
    if (result.updated) updatedCount++;
  }

  // Save the updated navigation document
  await Navigation.findOneAndUpdate(
    {},
    { $set: { items: currentItems } },
    { returnDocument: "after" }
  );

  console.log(`Navigation: ${createdCount} created, ${updatedCount} updated, ${createdCount + updatedCount} total`);
};