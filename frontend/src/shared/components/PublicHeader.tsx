"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, User as UserIcon, Bell, ChevronDown, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/store";
import { useAuth } from "@/modules/auth/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";
import { Avatar, Dropdown, DropdownItem } from "@/components/ui";
import { authRoutesConfig } from "@/modules/auth/routes";
import { settingsRoutesConfig } from "@/modules/settings.routes";
import { useStore } from "@/store";
import { useUsersStore } from "@/modules/users";
import { useHasPermission } from "@/store";

interface PublicHeaderProps {
  /** Whether to show auth buttons (Sign In / Get Started) */
  showAuthButtons?: boolean;
  /** Whether to show user dropdown (for authenticated users) */
  showUserDropdown?: boolean;
  /** Custom navigation items */
  navigation?: Array<{ label: string; href: string }>;
  /** Logo link destination */
  logoHref?: string;
  /** Logo text */
  logoText?: string;
  /** onMenu callback for mobile sidebar toggle (admin layout) */
  onMenu?: () => void;
  /** Whether to show mobile menu button */
  showMobileMenu?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  showAuthButtons = true,
  showUserDropdown = false,
  navigation = [
    { label: "Home", href: "/home" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  logoHref = "/home",
  logoText = "Nexus",
  onMenu,
  showMobileMenu = false,
}) => {
  const { theme, setTheme } = useTheme();
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roles } = useStore();
  const { users } = useUsersStore();
  const hasPermission = useHasPermission();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const currentRoleId = currentUser?.roleId ?? "";
  const currentRole = roles.find((r) => r.id === currentRoleId);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const results = query
    ? users
        .filter(
          (u) =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  const handleLogout = async () => {
    await logout();
    toast({ type: "info", title: "Signed out", description: "See you soon!" });
    navigate(authRoutesConfig.login(), { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to={logoHref} className="flex items-center gap-2" aria-label={`${logoText} Home`}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="font-black text-primary-foreground text-lg">N</span>
            </div>
            <span className="font-black text-lg text-foreground hidden sm:block">{logoText}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/home" && location.pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* User Search (only for authenticated users with permission) */}
          {showUserDropdown && hasPermission("pages.users") && (
            <div ref={ref} className="relative w-full max-w-md hidden lg:block">
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

              {showResults && results.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-border bg-popover shadow-xl animate-in">
                  <div className="p-1">
                    {results.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          navigate(`/users/${u.id}`);
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
          )}

          {/* Theme Toggle */}
          {/* <button
            onClick={toggle}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button> */}

          {/* Notifications (only for authenticated users) */}
          {showUserDropdown && (
            <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            </button>
          )}

          {showUserDropdown && <div className="mx-1 h-6 w-px bg-border" />}

          {/* Auth Buttons (for public pages) */}
          {showAuthButtons && !showUserDropdown && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* User Dropdown (for authenticated users) */}
          {showUserDropdown && currentUser && (
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
                      await handleLogout();
                    }}
                  >
                    <LogOut size={14} /> Sign out
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          )}

          {/* Mobile Menu Button */}
          {showMobileMenu && (
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => {
                if (onMenu) {
                  onMenu();
                } else {
                  setMobileMenuOpen(!mobileMenuOpen);
                }
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && showMobileMenu && (
        <div className="md:hidden py-4 border-t border-border">
          <div className="flex flex-col gap-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/home" && location.pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 text-base font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            {showAuthButtons && !showUserDropdown && (
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Link
                  to="/login"
                  className="px-4 py-2 text-center text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};