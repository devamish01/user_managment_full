import {
  HydratedDocument,
  InferSchemaType,
  Schema,
} from "mongoose";

export type Entity<T extends Schema> = HydratedDocument<
  InferSchemaType<T>
>;