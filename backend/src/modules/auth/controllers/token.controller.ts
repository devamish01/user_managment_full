import { Request, Response } from "express";

import { asyncHandler } from "@/shared/middlewares/index.js";
import { successResponse } from "@/shared/response/index.js";

import { refreshAccessToken } from "../services/refresh-token.service.js";


export const refreshToken = asyncHandler(
async (
req: Request,
res: Response,
) => {


const result = await refreshAccessToken(
  req.body.refreshToken,
);


return successResponse({
  res,
  message:"Token refreshed successfully.",
  data:result,
});


});