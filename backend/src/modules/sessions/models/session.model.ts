import { model } from "mongoose";
import { sessionSchema } from "./session.schema.js";

import { ISession } from "../types/session.type.js";
export const Session = model<ISession>(
  "Session",
  sessionSchema,
);