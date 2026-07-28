import { authRoutes } from "@/modules/auth/routes/index.js";
import heathRoutes from "@/modules/health/routes/index.js";
import { Router } from "express";

const routes = Router();

routes.use("/health",heathRoutes)
routes.use("/auth", authRoutes);
export default routes;