
import { Response } from "express";

interface SuccessResponseOptions <T =unknown> {
    res:Response;
    message:string;
    data?: T;
    statusCode?: number;
    meta?: Record<string, unknown>;
    errors?: unknown;
}


export const successResponse = <T>({
res,
message,
data,
statusCode =200,
meta = {},
errors = null,

}: SuccessResponseOptions<T>): Response => {
 return res.status(statusCode).json({
    success:true,
    status: statusCode,
    message,
    data,
    meta,
    errors,
 });

};

export const createdResponse = <T>({
  res,
  message,
  data,
  statusCode = 201,
  meta = {},
  errors = null,
}: SuccessResponseOptions<T>): Response => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data,
    meta,
    errors,
  });
};

interface ErrorResponseOptions {
  res: Response;
  message: string;
  statusCode?: number;
  errors?: unknown;
}


export const errorResponse = ({
    res,
    message,
    statusCode =500,
    errors,
}: ErrorResponseOptions) : Response => {
    return res.status(statusCode).json({
          success:false,
    status: statusCode,
    message,
    data: null,
    meta: {},
    errors,
 });
    
};
