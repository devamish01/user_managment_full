import bcrypt from "bcrypt";

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(
    plainPassword,
    hashedPassword,
  );
};