import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { logger } from "@/shared/logger/index.js";
import { formatZodError } from "@/shared/errors/zod-error.js";

import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";


export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {


  // Zod Validation Error

  if (error instanceof ZodError) {


    const fields = formatZodError(error);


    logger.warn({

      message:"Validation failed",

      errorCode:"VALIDATION_ERROR",

      fields,

      method:req.method,

      path:req.path,

    });



    return res.status(
      HTTP_STATUS.BAD_REQUEST
    ).json({

      success:false,

      message:"Validation failed",

      errorCode:"VALIDATION_ERROR",

      fields,

    });

  }



  // Business Error

  if(error instanceof AppError){


    logger.warn({

      message:error.message,

      errorCode:error.errorCode,

      method:req.method,

      path:req.path,

    });


    return res.status(
      error.statusCode
    ).json({

      success:false,

      message:error.message,

      errorCode:error.errorCode,

    });

  }



  // Unknown Error

  logger.error({

    message:error.message,

    stack:error.stack,

    method:req.method,

    path:req.path,

  });



  return res.status(
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  ).json({

    success:false,

    message:"Internal server error.",

    errorCode:"INTERNAL_SERVER_ERROR",

  });

};