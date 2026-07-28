import { z } from "zod";
import { registerSchema } from "../validations/register.schema.js";

export type RegisterUserInput = z.infer<typeof registerSchema>;