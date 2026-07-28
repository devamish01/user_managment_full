/**
 * Header — top bar of the AdminLayout (formerly "Topbar").
 *
 * Authentication identity is sourced exclusively from the auth module via
 * `useAuth().currentUser`. The legacy "Login as" / "Switch role" control
 * has been removed — role changes are no longer possible from the header.
 *
 * Contents:
 *   - mobile menu trigger
 *   - global user search with live result dropdown
 *   - theme toggle
 *   - notifications bell
 *   - user dropdown (name, email, role, profile link, sign-out)
 */

import * as React from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useTheme,
  useStore,
  useHasPermission,
} from "@/store";
import { Avatar, Dropdown, DropdownItem } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/modules/auth/hooks";
import { userRoutesConfig } from "@/modules/users/routes";
import { settingsRoutesConfig } from "@/modules/settings.routes";
import { authRoutesConfig } from "@/modules/auth/routes";
import { useUsersStore } from "@/modules/users";

export const Header = ({ onMenu }: { onMenu: () => void }) => {
  const { theme, toggle } = useTheme();
  const {  roles } = useStore();
  const { users } = useUsersStore();

  const hasPermission = useHasPermission();
  const { toast } = useToast();
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const currentRoleId = currentUser?.roleId ?? "";

  const [query, setQuery] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const currentRole = roles.find((r) => r.id === currentRoleId);

  const results = query
    ? users
        .filter(
          (u) =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div ref={ref} className="relative w-full max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search users..."
          className="h-9 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-16 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>

        {showResults && results.length > 0 && hasPermission("pages.users") && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-border bg-popover shadow-xl animate-in">
            <div className="p-1">
              {results.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    navigate(userRoutesConfig.details(u.id));
                    setQuery("");
                    setShowResults(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent"
                >
                  <Avatar name={u.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent">
              <Avatar name={currentUser?.name ?? "User"} size={32} />
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold leading-tight">{currentUser?.name ?? "—"}</p>
                <p className="text-[10px] text-muted-foreground">{currentRole?.name ?? "—"}</p>
              </div>
              <ChevronDown size={14} className="hidden text-muted-foreground md:block" />
            </button>
          }
        >
          {(close) => (
            <>
              <div className="border-b border-border px-2 py-2">
                <p className="text-sm font-semibold">{currentUser?.name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email ?? "—"}</p>
                {currentRole && (
                  <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r ${currentRole.color}`} />
                    {currentRole.name}
                  </p>
                )}
              </div>
              {hasPermission("pages.settings") && (
                <DropdownItem
                  onClick={() => {
                    navigate(settingsRoutesConfig.root());
                    close();
                  }}
                >
                  <UserIcon size={14} /> Profile & Settings
                </DropdownItem>
              )}
              <div className="my-1 h-px bg-border" />
              <DropdownItem
                destructive
                onClick={async () => {
                  close();
                  await logout();
                  toast({ type: "info", title: "Signed out", description: "See you soon!" });
                  navigate(authRoutesConfig.login(), { replace: true });
                }}
              >
                <LogOut size={14} /> Sign out
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </header>
  );
};
