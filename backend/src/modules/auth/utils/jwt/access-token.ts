import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { AccessTokenPayload } from "./types.js";

export const generateAccessToken = (
  payload: AccessTokenPayload,
): string => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );
};