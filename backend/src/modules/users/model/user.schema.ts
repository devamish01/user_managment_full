import {
  USER_ROLE,
  USER_ROLE_VALUES,
  USER_STATUS,
  USER_STATUS_VALUES,
} from "@/modules/users/constants/user.constants.js";
import { Schema } from "mongoose";

export const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    roleId: {
      type: String,
      default: 'r1',
      enum: 'r1',
    },

    role: {
      type: String,
      default: USER_ROLE.USER,
      enum: USER_ROLE_VALUES,
    },

    status: {
      type: String,
      default: USER_STATUS.PENDING,
      enum: USER_STATUS_VALUES,
    },
    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ===== Indexes =====

// Login
userSchema.index({ email: 1 }, { unique: true });

// Username search/login
userSchema.index({ username: 1 }, { unique: true });

// User listing
userSchema.index({ createdAt: -1 });
