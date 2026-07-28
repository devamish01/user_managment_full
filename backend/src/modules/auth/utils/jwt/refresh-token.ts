import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { RefreshTokenPayload } from "./types.js";

export const generateRefreshToken = (
  payload: RefreshTokenPayload,
): string => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  );
};