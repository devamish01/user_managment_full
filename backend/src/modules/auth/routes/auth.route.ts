
import { loginSchema } from '@/modules/auth/validations/login.schema.js';
import { registerSchema } from '@/modules/auth/validations/register.schema.js';
import { validate } from '@/shared/middlewares/validate.middleware.js';
import { Router } from 'express';
import {
  getAuthStatus,
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
  meController,
  getSession,
} from "@/modules/auth/controllers/index.js";
import { authMiddleware } from '@/shared/middlewares/index.js';

export const authRoutes =Router();


authRoutes.get("/", getAuthStatus);
authRoutes.post("/register",
      validate({
    body: registerSchema,
  }),
    registerUser,
)

authRoutes.post(
  "/login",
  validate({
    body: loginSchema,
  }),
  loginUser,
);
authRoutes.post(
 "/refresh",
 refreshToken
);
authRoutes.post(
  "/logout",
  authMiddleware,
  logoutUser,
);

authRoutes.get(
 "/me",
 authMiddleware,
 meController
);

authRoutes.get(
  "/session",
  authMiddleware,
  getSession
);