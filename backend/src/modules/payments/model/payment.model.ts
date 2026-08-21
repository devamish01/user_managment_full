import { model } from "mongoose";
import { paymentSchema } from "./payment.schema.js";
import type { IPayment } from "./payment.schema.js";

export const Payment = model<IPayment>(
  "Payment",
  paymentSchema,
);