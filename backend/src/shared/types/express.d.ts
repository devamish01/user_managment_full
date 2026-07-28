import type { z } from "zod";
import type { AccessTokenPayload } from "@/modules/auth/utils/index.js";

declare global {
  namespace Express {
    interface Request {

      validated?: {
        body?: z.infer<any>;
        params?: z.infer<any>;
        query?: z.infer<any>;
      };


      user?: AccessTokenPayload;

    }
  }
}

export {};