import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { RefreshTokenPayload } from "./types.js";

export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET,
  ) as RefreshTokenPayload;
}