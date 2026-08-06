export type Status = "active" | "inactive" | "blocked" | "pending";

export interface Permission {
  id: string;
  name: string;
  key: string;
  module: string;
  description: string;
  assignedRolesCount?: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissionIds: string[];
  createdAt: string;
  isSystem?: boolean;
  createdBy?: string; // User ID who created this role
  isDefault?: boolean; // Whether this is the default viewer role
}



export interface User {
  id: string;
  username: string;
  userId?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  roleId: string;
  role: string;
  status: Status;
  location: string;
  address: string;
  lastActive: string;
  approvedAt?: string;
  approvedBy?: string;
  /** Resolved approver name (populated by frontend from users data) */
  approvedByName?: string;

  createdAt: string;
  updatedAt: string;
  bio?: string;
  jobTitle?: string;
  /** Optional password hash — mock backend only; real backend would store a hash. */
  password?: string;
  permissionIds?: string[]; // extra overrides (not used in role)
  /** Whether the user is protected from modification/deletion */
  isProtected?: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  target: string;
  type: "create" | "update" | "delete" | "login" | "logout" | "permission";
  timestamp: string;
  ip: string;
}

/** Backend-provided navigation node. Children support future nested menus. */
export interface NavigationItem {
  id: string;
  title: string;
  icon?: string;
  route?: RouteName;
  permission?: string;
  order: number;
  visible: boolean;
  children?: NavigationItem[];
}

export type RouteName =
  | "dashboard"
  | "users"
  | "userDetails"
  | "userForm"
  | "permissions"
  | "assignment"
  | "logs"
  | "settings";
