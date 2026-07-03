import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    publicId: String,
    url: { type: String, required: true },
    alt: String,
    width: Number,
    height: Number
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    type: { type: String, required: true, trim: true, index: true },
    botanicalName: { type: String, trim: true },
    form: { type: String, trim: true },
    shelfLife: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    images: [imageSchema],
    specifications: {
      form: String,
      shelfLife: String,
      packaging: String,
      grade: String,
      minimumOrder: String
    },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "active", "archived"], default: "active", index: true }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", botanicalName: "text", shortDescription: "text", description: "text" });
productSchema.index({ type: 1, status: 1, sortOrder: 1, createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);