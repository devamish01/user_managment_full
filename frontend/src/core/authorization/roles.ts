/**
 * Authorization — role metadata and demo account registry.
 *
 * The role metadata (display label, gradient, blurb, demo credentials) is
 * authorization-domain data: it describes *who* a principal is, not *how*
 * they authenticate. Authentication concerns (token storage, session
 * restore) live in `modules/auth`, never here.
 *
 * Demo accounts are surfaced in the login surface so testers can sign in
 * without memorising credentials. Production builds would source this list
 * from configuration, not from a hard-coded map.
 */

export const SUPER_ADMIN_ROLE_ID = "r1";
export const ADMIN_ROLE_ID = "r2";
export const MANAGER_ROLE_ID = "r3";
export const VIEWER_ROLE_ID = "r4";

export interface RoleDisplay {
  id: string;
  label: string;
  gradient: string;
  blurb: string;
  email: string;
  password: string;
}

export const ROLE_DISPLAY: Record<string, RoleDisplay> = {
  r1: {
    id: "r1",
    label: "Super Admin",
    gradient: "from-violet-500 to-indigo-600",
    blurb: "Full control",
    email: "superadmin@nexus.com",
    password: "superadmin",
  },
  r2: {
    id: "r2",
    label: "Admin",
    gradient: "from-blue-500 to-cyan-500",
    blurb: "Manage users",
    email: "admin@nexus.com",
    password: "admin",
  },
  r3: {
    id: "r3",
    label: "Manager",
    gradient: "from-emerald-500 to-teal-500",
    blurb: "Team lead",
    email: "manager@nexus.com",
    password: "manager",
  },
  r4: {
    id: "r4",
    label: "Viewer",
    gradient: "from-slate-500 to-slate-700",
    blurb: "Read only",
    email: "viewer@nexus.com",
    password: "viewer",
  },
};

export interface DemoAccount {
  roleId: string;
  email: string;
  password: string;
}

/** Primary demo accounts surfaced on the login surface. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { roleId: "r1", email: "superadmin@nexus.com", password: "superadmin" },
  { roleId: "r2", email: "admin@nexus.com",      password: "admin" },
  { roleId: "r3", email: "manager@nexus.com",    password: "manager" },
];

/** Lookup a role's display metadata, falling back to a neutral placeholder. */
export const getRoleDisplay = (roleId: string): RoleDisplay =>
  ROLE_DISPLAY[roleId] ?? {
    id: roleId,
    label: roleId,
    gradient: "from-slate-500 to-slate-700",
    blurb: "",
    email: "",
    password: "",
  };

export const isSuperAdmin = (roleId: string | null | undefined): boolean =>
  roleId === SUPER_ADMIN_ROLE_ID;
