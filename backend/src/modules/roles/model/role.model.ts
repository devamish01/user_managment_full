import mongoose, { Schema, Document } from "mongoose";
import { IRole } from "../types/role.type.js";

export interface IRoleDocument extends Document, Omit<IRole, "roleId"> {
  _id: mongoose.Types.ObjectId;
  roleId: string;
}

const roleSchema = new Schema<IRoleDocument>(
  {
    roleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    permissionIds: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: "from-slate-500 to-slate-600",
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

roleSchema.index({ name: 1 }, { unique: true });
roleSchema.index({ createdAt: -1 });

export const Role = mongoose.model<IRoleDocument>("Role", roleSchema);
export { roleSchema };