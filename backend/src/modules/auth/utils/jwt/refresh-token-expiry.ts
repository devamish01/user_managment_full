import ms from "ms";
import { env } from "@/config/env.js";

export const getRefreshTokenExpiry = (): Date => {
  return new Date(
    Date.now() +
      ms(env.JWT_REFRESH_EXPIRES_IN as ms.StringValue),
  );
};