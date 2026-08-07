import type { Request, Response } from "express";
import { successResponse } from "@/shared/response/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { verifyAccessToken } from "@/modules/auth/utils/index.js";
import { findActiveSession } from "@/modules/sessions/index.js";
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    roleId: string;
    isSuperAdmin: boolean;
    sessionId: string;
  };
}

export const getSession = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError({
        message: "Authorization token missing.",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: "TOKEN_MISSING",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
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

    // Verify JWT and extract payload
    const payload = verifyAccessToken(token);

    // Find active session
    const session = await findActiveSession(payload.sessionId, payload.userId);

    if (!session) {
      throw new AppError({
        message: "Session expired or logged out.",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: "SESSION_EXPIRED",
      });
    }

    // Return session info matching frontend AuthSession interface
    // Note: refreshToken is not stored in plain text, so we return empty string
    // The frontend gets refreshToken from login response and stores it in session state
    return successResponse({
      res,
      message: "Session retrieved successfully",
      data: {
        accessToken: token,
        refreshToken: "", // Not stored in plain text; frontend retains from login
        currentUserId: payload.userId,
        rememberMe: true, // Could be derived from session expiry in future
        loginAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
      },
    });
  },
);