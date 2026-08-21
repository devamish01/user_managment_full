import { authRoutes } from "@/modules/auth/routes/index.js";
import heathRoutes from "@/modules/health/routes/index.js";
import { navigationRoutes } from "@/modules/navigation/routes/index.js";
import { userRoutes } from "@/modules/users/routes/index.js";
import { roleRoutes } from "@/modules/roles/routes/index.js";
import { permissionRoutes } from "@/modules/permissions/routes/index.js";
import { paymentRoutes } from "@/modules/payments/routes/payment.route.js";
import { Router } from "express";

const routes = Router();

routes.use("/health", heathRoutes);
routes.use("/auth", authRoutes);
routes.use("/navigation", navigationRoutes);
routes.use("/users", userRoutes);
routes.use("/roles", roleRoutes);
routes.use("/permissions", permissionRoutes);
routes.use("/payments", paymentRoutes);
export default routes;