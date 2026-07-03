import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    publicId: String,
    url: String,
    alt: String,
    width: Number,
    height: Number
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    image: imageSchema,
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "active", "archived"], default: "active", index: true }
  },
  { timestamps: true }
);

categorySchema.index({ status: 1, sortOrder: 1 });

export const Category = mongoose.model("Category", categorySchema);