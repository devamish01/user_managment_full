import type { Request, Response } from "express";
import type { AuthRequest } from "@/shared/middlewares/auth.middleware.js";
import { successResponse, createdResponse } from "@/shared/response/index.js";
import { USER_MESSAGES } from "@/modules/users/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "@/modules/users/index.js";
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema, userQuerySchema } from "@/modules/users/index.js";
import type { IUser } from "@/modules/users/index.js";

export const getUsersController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const result = await getUsers(req.query as any);

    return successResponse<IUser[]>({
      res,
      message: USER_MESSAGES.FETCH_SUCCESS,
      data: result.data,
      meta: {
        pagination: result.pagination,
        stats: result.stats,
      },
    });
  },
);

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const user = await getUserById(req.params.id as string);

    return successResponse<IUser>({
      res,
      message: USER_MESSAGES.FETCH_ONE_SUCCESS,
      data: user,
    });
  },
);

export const createUserController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const user = await createUser(req.body);

    return createdResponse<IUser>({
      res,
      message: USER_MESSAGES.CREATE_SUCCESS,
      data: user,
    });
  },
);

export const updateUserController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const user = await updateUser(req.params.id as string, req.body, req.user?.userId, req.user?.role);

    return successResponse<IUser>({
      res,
      message: USER_MESSAGES.UPDATE_SUCCESS,
      data: user,
    });
  },
);

export const deleteUserController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    await deleteUser(req.params.id as string, req.user?.role);

    return successResponse({
      res,
      message: USER_MESSAGES.DELETE_SUCCESS,
      data: { ok: true },
    });
  },
);