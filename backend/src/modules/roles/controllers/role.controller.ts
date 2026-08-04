import type { Request, Response } from "express";
import { successResponse, createdResponse } from "@/shared/response/index.js";
import { ROLE_MESSAGES } from "@/modules/roles/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { getRoles, createRole, updateRole, deleteRole } from "@/modules/roles/index.js";
import type { IRole } from "@/modules/roles/index.js";

/**
 * Transform database role to frontend mock contract format.
 * This is a response transformation layer only - does not affect database or business logic.
 */
const transformRoleForFrontend = (role: any) => ({
  id: role.roleId,
  name: role.name,
  description: role.description,
  color: role.color,
  permissionIds: role.permissionIds || [],
  createdAt: role.createdAt,
  isSystem: role.isSystem ?? true,
});

export const getRolesController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const result = await getRoles(req.query as any);

    // Transform roles to match frontend mock contract
    const transformedRoles = result.data.map(transformRoleForFrontend);

    return successResponse({
      res,
      message: ROLE_MESSAGES.FETCH_SUCCESS,
      data: transformedRoles,
      meta: {
        pagination: result.pagination,
      },
    });
  },
);

export const createRoleController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const createdBy = (req as any).user?.userId || (req as any).user?.id || "SYSTEM";
    const role = await createRole(req.body, createdBy);

    return createdResponse({
      res,
      message: ROLE_MESSAGES.CREATE_SUCCESS,
      data: transformRoleForFrontend(role),
    });
  },
);

export const updateRoleController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const role = await updateRole(req.params.id as string, req.body);

    return successResponse({
      res,
      message: ROLE_MESSAGES.UPDATE_SUCCESS,
      data: transformRoleForFrontend(role),
    });
  },
);

export const deleteRoleController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    await deleteRole(req.params.id as string);

    return successResponse({
      res,
      message: ROLE_MESSAGES.DELETE_SUCCESS,
      data: { ok: true },
    });
  },
);