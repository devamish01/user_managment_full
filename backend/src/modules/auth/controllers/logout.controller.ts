import { Request, Response } from "express";

import { asyncHandler } from "@/shared/middlewares/index.js";
import { successResponse } from "@/shared/response/index.js";

import { logout } from "../services/index.js";


export const logoutUser = asyncHandler(
  async (
    req: Request,
    res: Response,
  ) => {

    await logout(
      req.user!.sessionId,
    );


    return successResponse({
      res,
      message: "Logout successful.",
    });
  },
);