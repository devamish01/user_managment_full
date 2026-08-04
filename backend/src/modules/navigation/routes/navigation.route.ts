import { Router } from "express";
import { getNavigationController } from "@/modules/navigation/index.js";
import { authMiddleware } from "@/shared/middlewares/index.js";

export const navigationRoutes = Router();

navigationRoutes.get("/", authMiddleware, getNavigationController);