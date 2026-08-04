import type { Request, Response } from "express";
import { successResponse } from "@/shared/response/index.js";
import { NAVIGATION_MESSAGES } from "@/modules/navigation/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { getNavigation } from "@/modules/navigation/index.js";

export const getNavigationController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const navigation = await getNavigation();

    return successResponse({
      res,
      message: NAVIGATION_MESSAGES.FETCH_SUCCESS,
      data: navigation,
    });
  },
);