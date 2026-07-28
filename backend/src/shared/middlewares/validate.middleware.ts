import { NextFunction, Request, Response } from "express";
import { z } from "zod";

type ValidationSchemas = {
  body?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
};

export const validate = (schemas: ValidationSchemas) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      const validated = {
        body: schemas.body?.parse(req.body),
        params: schemas.params?.parse(req.params),
        query: schemas.query?.parse(req.query),
      };

      req.validated = validated;

      next();
    } catch (error) {
      next(error);
    }
  };
};