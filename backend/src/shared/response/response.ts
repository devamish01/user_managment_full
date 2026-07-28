
import { Response } from "express";

interface SuccessResponseOptions <T =unknown> {
    res:Response;
    message:string;
    data?: T;
    statusCode?: number;
}


export const successResponse = <T>({
res,
message,
data,
statusCode =200,

}: SuccessResponseOptions<T>): Response => {
 return res.status(statusCode).json({
    success:true,
    message,
    data,
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
    message,
    errors,
 });
    
};
