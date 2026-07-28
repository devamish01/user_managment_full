import type { z } from "zod";
import type { loginSchema } from "../validations/login.schema.js";

export type LoginInput = z.infer<typeof loginSchema>;
// Purpose

// Login request ki type.
// Controller aur Service dono isi type ko use karenge.