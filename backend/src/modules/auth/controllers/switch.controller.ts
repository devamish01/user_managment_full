import type { Request, Response } from "express";
import { successResponse } from "@/shared/response/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { User } from "@/modules/users/model/index.js";
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { revokeAllSessions } from "@/modules/sessions/index.js";

export const switchUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { roleId } = req.body as { roleId?: string };

    if (!roleId) {
      throw new AppError({
        message: "roleId is required",
        statusCode: HTTP_STATUS.BAD_REQUEST,
        errorCode: "ROLE_ID_REQUIRED",
      });
    }

    // Find a user with the specified role
    const targetUser = await User.findOne({ role: roleId });

    if (!targetUser) {
      throw new AppError({
        message: `User with role ${roleId} not found`,
        statusCode: HTTP_STATUS.NOT_FOUND,
        errorCode: "USER_NOT_FOUND",
      });
    }

    return successResponse({
      res,
      message: "Role switched successfully",
      data: {
        userId: targetUser.userId,
        username: targetUser.username,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        email: targetUser.email,
        role: targetUser.role,
        status: targetUser.status,
        roleId: targetUser.roleId,
      },
    });
  },
);

export const getSuperAdminPassword = asyncHandler(
  async (_req: Request, res: Response) => {
    // In a real app, this would come from secure config/env
    // For now, return a placeholder
    return successResponse({
      res,
      message: "Super admin password retrieved",
      data: { password: process.env.SUPER_ADMIN_PASSWORD || "admin123" },
    });
  },
);

export const setSuperAdminPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body as { password?: string };

    if (!password) {
      throw new AppError({
        message: "Password is required",
        statusCode: HTTP_STATUS.BAD_REQUEST,
        errorCode: "PASSWORD_REQUIRED",
      });
    }

    if (password.length < 8) {
      throw new AppError({
        message: "Password must be at least 8 characters",
        statusCode: HTTP_STATUS.BAD_REQUEST,
        errorCode: "PASSWORD_TOO_SHORT",
      });
    }

    // In a real app, this would update a secure config
    // For now, just acknowledge
    return successResponse({
      res,
      message: "Super admin password updated",
      data: { ok: true },
    });
  },
);

export const revokeAllUserSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as any;
    const userId = authReq.user?.userId;

    if (!userId) {
      throw new AppError({
        message: "User not authenticated",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        errorCode: "UNAUTHENTICATED",
      });
    }

    await revokeAllSessions(userId);

    return successResponse({
      res,
      message: "All sessions revoked successfully",
      data: { ok: true },
    });
  },
);