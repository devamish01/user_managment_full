import { Router } from "express";
import {
  getPermissionsController,
  getPermissionByIdController,
  createPermissionController,
  updatePermissionController,
  deletePermissionController,
} from "@/modules/permissions/controllers/permission.controller.js";
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { authMiddleware } from "@/shared/middlewares/index.js";
import { createPermissionSchema, updatePermissionSchema, permissionIdParamSchema, permissionQuerySchema } from "@/modules/permissions/validations/permission.schema.js";

export const permissionRoutes = Router();
permissionRoutes.get(
  "/",
  authMiddleware,
  validate({ query: permissionQuerySchema }),
  getPermissionsController,
);

permissionRoutes.get(
  "/:id",
  authMiddleware,
  validate({ params: permissionIdParamSchema }),
  getPermissionByIdController,
);

permissionRoutes.post(
  "/",
  authMiddleware,
  validate({ body: createPermissionSchema }),
  createPermissionController,
);

permissionRoutes.put(
  "/:id",
  authMiddleware,
  validate({ params: permissionIdParamSchema, body: updatePermissionSchema }),
  updatePermissionController,
);

permissionRoutes.patch(
  "/:id",
  authMiddleware,
  validate({ params: permissionIdParamSchema, body: updatePermissionSchema }),
  updatePermissionController,
);

permissionRoutes.delete(
  "/:id",
  authMiddleware,
  validate({ params: permissionIdParamSchema }),
  deletePermissionController,
);