import { Response, Request } from "express";
import { successResponse } from "@/shared/response/index.js";

export const heathCheck = (
    _req: Request,
     res: Response
): Response => {
    return successResponse({
        res,
        message: "server is healthy",
    });
};
