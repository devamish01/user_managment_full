import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verifyAccessToken,
} from "@/modules/auth/utils/index.js";

import {
  findActiveSession,
  updateLastActive,
} from "@/modules/sessions/index.js";

import {
  AppError,
} from "@/shared/errors/index.js";

import {
  HTTP_STATUS,
} from "@/shared/constants/http-status.js";


export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    roleId: string;
    isSuperAdmin: boolean;
    sessionId: string;
  };
}


export const authMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {

  const authHeader = req.headers.authorization;


  if (!authHeader) {
    throw new AppError({
      message: "Authorization token missing.",
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "TOKEN_MISSING",
    });
  }


  const parts = authHeader.split(" ");

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {
    throw new AppError({
      message: "Invalid authorization format.",
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "INVALID_TOKEN_FORMAT",
    });
  }

  const token = parts[1];

  if (!token) {
    throw new AppError({
      message: "Authorization token missing.",
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "TOKEN_MISSING",
    });
  }

  // Verify JWT
  const payload = verifyAccessToken(
    token,
  );


  // Check Session Status
  const session = await findActiveSession(
    payload.sessionId,
    payload.userId,
  );


  if (!session) {
    throw new AppError({
      message: "Session expired or logged out.",
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: "SESSION_EXPIRED",
    });
  }


  // Update Activity
  await updateLastActive(
    payload.sessionId,
  );


  // Attach User
  req.user = {
    userId: payload.userId,
    role: payload.role,
    roleId: payload.roleId,
    isSuperAdmin: payload.isSuperAdmin,
    sessionId: payload.sessionId,
  };


  next();
};