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

export type PaymentStatus = "Pending" | "Completed" | "Rejected" | "Refunded";
export type PaymentDirection = "credit" | "debit";
export type PaymentCategory = "Donation" | "Giveaway" | "Event" | "Charity" | "Manual" | "Refund" | "Other";
export type PaymentSource = "ADMIN_ADDED" | "USER_PAYMENT" | "GATEWAY" | "SYSTEM";
export type PaymentMethod = "PhonePe" | "Google Pay" | "UPI" | "Bank Transfer" | "Cash" | "Other";

export interface PaymentUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PaymentCreatedByInfo {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface PaymentRecord {
  id: string;
  user: PaymentUser;
  amount: number;
  direction: PaymentDirection;
  status: PaymentStatus;
  category: PaymentCategory;
  paymentSource: PaymentSource;
  paymentMethod: PaymentMethod;
  utrNumber: string;
  notes: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  createdByInfo: PaymentCreatedByInfo;
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
  avatarColor?: string;
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
  | "settings"
  | "payments"
  | "transactions";
