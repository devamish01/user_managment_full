import { User } from "@/modules/users/model/index.js";

import {
  verifyRefreshToken,
  generateAccessToken,
} from "@/modules/auth/utils/index.js";

import {
  findActiveSession,
  updateLastActive,
} from "@/modules/sessions/index.js";

import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";


export const refreshAccessToken = async (
  refreshToken: string,
) => {

  // 1. Verify Refresh Token
  const payload = verifyRefreshToken(
    refreshToken,
  );


  // 2. Find Active Session
const session = await findActiveSession(
  payload.sessionId,
  payload.userId,
);


  if (!session) {
    throw new AppError({
      message: "Session expired or revoked.",
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "SESSION_EXPIRED",
    });
  }


  // 3. Find Latest User Data
  const user = await User.findOne({
    userId: payload.userId,
  });


  if (!user) {
    throw new AppError({
      message: "User not found.",
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "USER_NOT_FOUND",
    });
  }


  // 4. Generate New Access Token
  const accessToken = generateAccessToken({
    userId: user.userId,
    role: user.role,
    roleId: user.roleId,
    isSuperAdmin: user.roleId === "r1",
    sessionId: session.sessionId,
  });


  // 5. Update Session Activity
  await updateLastActive(
    session.sessionId,
  );


  return {
    accessToken,
  };
};