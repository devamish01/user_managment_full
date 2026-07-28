import { Schema } from "mongoose";

export const sessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    device: {
      type: String,
      default: null,
      trim: true,
    },

    browser: {
      type: String,
      default: null,
      trim: true,
    },

    os: {
      type: String,
      default: null,
      trim: true,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


// indexes
sessionSchema.index({ sessionId: 1 }, { unique: true });

sessionSchema.index({ userId: 1 });

sessionSchema.index({ expiresAt: 1 });