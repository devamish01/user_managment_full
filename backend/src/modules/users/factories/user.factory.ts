import { RegisterUserInput } from "@/modules/auth/types/register.type.js";
import { USER_ROLE } from "@/modules/users/constants/user.constants.js";
import { generateUserId } from "@/modules/users/utils/index.js";

export const createUserPayload = (
  data: RegisterUserInput,
  hashedPassword: string,
  userId: string,

  options: {
    role: typeof USER_ROLE[keyof typeof USER_ROLE];
    roleId: string;
    status: "active" | "inactive" | "blocked" | "pending";
    approvedAt: Date | null;
    approvedBy: string | null;
    isProtected?: boolean;
  },
) => {
  // First Super Admin (USR-00001 with roleId r1) gets isProtected = true
  const isFirstSuperAdmin = userId === "USR-00001" && options.roleId === "r1";
  
  return {
    userId,

    username: data.username,

    firstName: data.firstName,

    lastName: data.lastName,

    email: data.email,

    password: hashedPassword,

    role: options.role,
    roleId: options.roleId,
    status: options.status,
    approvedAt: options.approvedAt,
    approvedBy: options.approvedBy,
    isProtected: options.isProtected ?? false,
    phone: data.phone || "",
    location: data.location || "",
    address: data.address || "",
    bio: data.bio || "",
    lastActive: null,
  } as const;
};
