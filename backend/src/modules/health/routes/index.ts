import { heathCheck } from "@/modules/health/controllers/health.controllers.js";
import { Router } from "express";

const heathRoutes = Router();
heathRoutes.get("/",heathCheck);
export default heathRoutes