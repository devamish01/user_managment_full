import { Request, Response, NextFunction } from "express";

export const noCacheMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });

  next();
};