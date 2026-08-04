import mongoose, { Schema, Document } from "mongoose";
import { NavigationItem } from "../types/navigation.types.js";

export interface INavigation extends Document {
  _id: mongoose.Types.ObjectId;
  items: NavigationItem[];
}

const navigationItemSchema = new Schema<NavigationItem>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  visible: { type: Boolean, default: true },
  icon: { type: String },
  route: { type: String },
  permission: { type: String },
  children: [{ type: Schema.Types.Mixed }],
}, { _id: false });

const navigationSchema = new Schema<INavigation>({
  items: [navigationItemSchema],
}, {
  timestamps: true,
  collection: "navigation",
});

navigationSchema.index({ "items.order": 1 });

export const Navigation = mongoose.model<INavigation>("Navigation", navigationSchema);