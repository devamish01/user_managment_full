import mongoose, { Schema } from "mongoose";
import { IPermission, IPermissionDocument } from "../types/permission.type.js";

const permissionSchema = new Schema<IPermissionDocument>(
  {
    id: {
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
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

permissionSchema.index({ name: 1 });
permissionSchema.index({ module: 1, key: 1 });
permissionSchema.index({ createdAt: -1 });

export const Permission = mongoose.model<IPermissionDocument>("Permission", permissionSchema);
export { permissionSchema };