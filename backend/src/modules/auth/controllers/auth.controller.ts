import type { Request, Response } from "express";
import { successResponse } from "@/shared/response/index.js";
import { AUTH_MESSAGES } from "@/modules/auth/constants/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import {register , login , logout, getMe } from "@/modules/auth/services/index.js";

export const getAuthStatus = (
  _req: Request,
  res: Response,
): Response => {
  return successResponse({
    res,
    message: AUTH_MESSAGES.MODULE_RUNNING,
  });
};

// Iska kaam:

// Request lena
// Service ko call karna
// Response bhejna

export const registerUser = asyncHandler(
  async (req, res) => {
const user = await register(
  req.body,
);
    return successResponse({
      res,
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data: user,
    });
  },
);

export const loginUser = asyncHandler(
  async (req, res) => {

    const result = await login(
      req.body,
    );

    return successResponse({
      res,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: result,
    });
  },
);
export const meController = async (
 req:any,
 res:any
)=>{

 const user = await getMe(
   req.user.userId
 );


 return res.status(200).json({
   success:true,
   message:"User fetched successfully",
   data:user,
 });

};
export const logoutUser = asyncHandler(
  async (
    req,
    res,
  ) => {

    await logout(
      req.user!.sessionId,
    );

    return successResponse({
      res,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  },
);