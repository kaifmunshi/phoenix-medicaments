import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: {
      publicId: String,
      url: { type: String, required: true },
      alt: String,
      width: Number,
      height: Number
    },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "active"], default: "active" }
  },
  { timestamps: true }
);

certificateSchema.index({ status: 1, sortOrder: 1 });

export const Certificate = mongoose.model("Certificate", certificateSchema);

