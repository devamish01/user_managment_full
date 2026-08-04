import { User } from "@/modules/users/model/index.js";

export const generateUserId = async () => {
  const lastUser = await User.findOne().sort({ userId: -1 });

  if (!lastUser) {
    return "USR-00001";
  }

  const lastNumber = Number(lastUser.userId.replace("USR-", ""));

  return `USR-${String(lastNumber + 1).padStart(5, "0")}`;
};