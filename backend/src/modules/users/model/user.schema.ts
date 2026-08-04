import {
  USER_ROLE,
  USER_ROLE_VALUES,
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
      required: true,
      trim: true,
    },

    role: {
      type: String,
      default: USER_ROLE.USER,
      enum: USER_ROLE_VALUES,
    },

    status: {
      type: String,
      default: "pending",
      enum: USER_STATUS_VALUES,
    },

    isProtected: {
      type: Boolean,
      default: false,
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
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    lastActive: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for full name
userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ===== Indexes =====

// Login
userSchema.index({ email: 1 }, { unique: true });

// Username search/login
userSchema.index({ username: 1 }, { unique: true });

// User listing
userSchema.index({ createdAt: -1 });
