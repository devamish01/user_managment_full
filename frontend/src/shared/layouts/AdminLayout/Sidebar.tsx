/**
 * Sidebar — navigation rail of the AdminLayout.
 * Moved verbatim from components/layout/AppLayout.tsx (Phase 4.1).
 * Data source: Store → NavigationService → API → mock backend (Phase 3.7).
 * Permission filtering uses the existing hasPermission() system.
 */

import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  ToggleRight,
  Activity,
  Settings,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  useStore,
  useHasPermission,
} from "@/store";
import { useNavigationStore } from "@/modules/navigation/store";
import { SidebarSkeleton } from "@/modules/navigation/components";
import { EmptyState, ErrorState } from "@/shared/components/states";
import { Inbox } from "lucide-react";
/** Route-name → path resolver that replaces the removed routeMapping layer. */
const routeNameToPath: Record<string, string> = {
  dashboard:   "/dashboard",
  users:       "/users",
  permissions: "/permissions",
  assignment:  "/assignment",
  logs:        "/logs",
  settings:    "/settings",
};

/** Maps backend icon identifiers to the existing visual icon set. */
const navigationIcons: Record<string, React.ReactNode> = {
  "layout-dashboard": <LayoutDashboard size={18} />,
  users: <Users size={18} />,
  "toggle-right": <ToggleRight size={18} />,
  key: <Key size={18} />,
  activity: <Activity size={18} />,
  settings: <Settings size={18} />,
};

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRoleId, roles } = useStore();
  const { navigation, loading: navLoading, error: navError, getNavigation } = useNavigationStore();
  const hasPermission = useHasPermission();

  React.useEffect(() => {
    getNavigation();
  }, [getNavigation]);
  // Derive the active route name from the first URL segment.
  const currentRouteName = location.pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const isActive = (name?: string) => Boolean(name && name === currentRouteName);
  const currentRole = roles.find((r) => r.id === currentRoleId);

  const visibleNav = navigation
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      ...section,
      children: (section.children || [])
        .filter((item) => item.visible && (!item.permission || hasPermission(item.permission)))
        .sort((a, b) => a.order - b.order),
    }))
    .filter((section) => section.children.length > 0);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {navLoading ? (
          <SidebarSkeleton />
        ) : (
        <>
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Nexus</h1>
              <p className="text-[10px] font-medium text-muted-foreground">Admin Console</p>
            </div>
          </div>
          <button
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navError ? (
            <div className="px-3">
              <ErrorState
                title="Navigation failed to load"
                description={navError}
                onRetry={getNavigation}
                retryLabel="Retry"
                className="border-0 bg-transparent p-4"
              />
            </div>
          ) : visibleNav.length === 0 ? (
            <div className="px-3">
              <EmptyState
                icon={<Inbox size={18} />}
                title="No navigation available"
                description="Your role has no page permissions assigned. Ask a Super Admin to grant access."
                className="border-0 bg-transparent p-4"
              />
            </div>
          ) : visibleNav.map((section) => (
            <div key={section.id} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.children.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if (item.route) navigate(routeNameToPath[item.route] ?? `/${item.route}`);
                        onClose();
                      }}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isActive(item.route)
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "transition-transform group-hover:scale-110",
                          isActive(item.route) && "scale-105",
                        )}
                      >
                        {item.icon ? navigationIcons[item.icon] : null}
                      </span>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 p-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${currentRole?.color || "from-primary to-purple-600"} text-white`}>
              <Shield size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold">Signed in as</p>
              <p className="truncate text-[10px] text-muted-foreground">{currentRole?.name}</p>
            </div>
          </div>
        </div>
        </>
        )}
      </aside>
    </>
  );
};
