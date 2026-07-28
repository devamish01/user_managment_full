import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { AccessTokenPayload } from "./types.js";

export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
  ) as AccessTokenPayload;
}