import { Router } from "express";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  resetUserPasswordController,
} from "@/modules/users/index.js";
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { authMiddleware } from "@/shared/middlewares/index.js";
import { createUserSchema, updateUserSchema, userQuerySchema, resetPasswordSchema } from "@/modules/users/index.js";

export const userRoutes = Router();

userRoutes.get(
  "/",
  authMiddleware,
  validate({ query: userQuerySchema }),
  getUsersController,
);

userRoutes.post(
  "/",
  authMiddleware,
  validate({ body: createUserSchema }),
  createUserController,
);

userRoutes.get(
  "/:id",
  authMiddleware,
  getUserByIdController,
);

userRoutes.put(
  "/:id",
  authMiddleware,
  validate({ body: updateUserSchema }),
  updateUserController,
);

userRoutes.patch(
  "/:id",
  authMiddleware,
  validate({ body: updateUserSchema }),
  updateUserController,
);

userRoutes.delete(
  "/:id",
  authMiddleware,
  deleteUserController,
);

userRoutes.post(
  "/:id/reset-password",
  authMiddleware,
  validate({ body: resetPasswordSchema }),
  resetUserPasswordController,
);