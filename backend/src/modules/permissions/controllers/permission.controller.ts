import type { Request, Response } from "express";
import { successResponse, createdResponse } from "@/shared/response/index.js";
import { PERMISSION_MESSAGES } from "@/modules/permissions/types/permission.type.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { getPermissions, getPermissionById, createPermission, updatePermission, deletePermission } from "@/modules/permissions/services/permission.service.js";
import type { IPermissionDocument } from "@/modules/permissions/types/permission.type.js";

export const getPermissionsController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const result = await getPermissions(req.query as any);

    return successResponse<IPermissionDocument[]>({
      res,
      message: PERMISSION_MESSAGES.FETCH_SUCCESS,
      data: result.data,
      meta: {
        pagination: result.pagination,
      },
    });
  },
);

export const getPermissionByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const permission = await getPermissionById(req.params.id as string);

    return successResponse<IPermissionDocument>({
      res,
      message: PERMISSION_MESSAGES.FETCH_ONE_SUCCESS,
      data: permission,
    });
  },
);

export const createPermissionController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const permission = await createPermission(req.body);

    return createdResponse<IPermissionDocument>({
      res,
      message: PERMISSION_MESSAGES.CREATE_SUCCESS,
      data: permission,
    });
  },
);

export const updatePermissionController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const permission = await updatePermission(req.params.id as string, req.body);

    return successResponse<IPermissionDocument>({
      res,
      message: PERMISSION_MESSAGES.UPDATE_SUCCESS,
      data: permission,
    });
  },
);

export const deletePermissionController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    await deletePermission(req.params.id as string);

    return successResponse({
      res,
      message: PERMISSION_MESSAGES.DELETE_SUCCESS,
      data: { ok: true },
    });
  },
);