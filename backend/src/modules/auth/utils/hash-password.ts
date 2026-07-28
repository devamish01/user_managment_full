import bcrypt from "bcrypt";
import { env } from "@/config/env.js";

export const hashPassword = async (
  password: string,
): Promise<string> => {
  return bcrypt.hash(
    password,
    env.BCRYPT_SALT_ROUNDS,
  );
};