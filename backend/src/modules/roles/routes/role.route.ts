import { Router } from "express";
import {
  getRolesController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
} from "@/modules/roles/index.js";
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { authMiddleware } from "@/shared/middlewares/index.js";
import { roleQuerySchema, createRoleSchema, updateRoleSchema, roleIdParamSchema } from "@/modules/roles/index.js";

export const roleRoutes = Router();

roleRoutes.get(
  "/",
  authMiddleware,
  validate({ query: roleQuerySchema }),
  getRolesController,
);

roleRoutes.post(
  "/",
  authMiddleware,
  validate({ body: createRoleSchema }),
  createRoleController,
);

roleRoutes.put(
  "/:id",
  authMiddleware,
  validate({ params: roleIdParamSchema, body: updateRoleSchema }),
  updateRoleController,
);

roleRoutes.patch(
  "/:id",
  authMiddleware,
  validate({ params: roleIdParamSchema, body: updateRoleSchema }),
  updateRoleController,
);

roleRoutes.delete(
  "/:id",
  authMiddleware,
  validate({ params: roleIdParamSchema }),
  deleteRoleController,
);