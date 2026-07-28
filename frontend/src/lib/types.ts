export type Status = "active" | "inactive" | "blocked";

export interface Permission {
  id: string;
  name: string;
  key: string;
  module: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissionIds: string[];
  createdAt: string;
  isSystem?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  lead: string;
  memberCount: number;
  color: string;
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
  departmentId: string;
  status: Status;
  jobTitle: string;
  location: string;
  address: string;
  lastActive: string;
  approvedAt?: string;
  approvedBy?: string;

  createdAt: string;
  updatedAt: string;
  bio?: string;
  /** Optional password hash — mock backend only; real backend would store a hash. */
  password?: string;
  permissionIds?: string[]; // extra overrides (not used in role)
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
