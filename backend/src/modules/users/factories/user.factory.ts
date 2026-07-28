import { RegisterUserInput } from "@/modules/auth/types/register.type.js";
import { UserRole, UserStatus } from "@/modules/users/constants/user.constants.js";
import { generateUserId } from "@/modules/users/utils/index.js";

export const createUserPayload = (
  data: RegisterUserInput,
  hashedPassword: string,
    options: {
    role: UserRole;
    status: UserStatus;
    approvedAt: Date | null;
    approvedBy: string | null;
  },
) => {
  return {
    userId: generateUserId(),

    username: data.username,

    firstName: data.firstName,

    lastName: data.lastName,

    email: data.email,

    password: hashedPassword,

    role: options.role,
    status: options.status,
    approvedAt: options.approvedAt,
    approvedBy: options.approvedBy,
  };
};
