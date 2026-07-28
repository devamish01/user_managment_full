import { model } from "mongoose";
import { userSchema } from "./user.schema.js";
import { IUser } from "./user.type.js";

export const User = model<IUser>(
  "User",
  userSchema,
);