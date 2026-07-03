import { Readable } from "node:stream";
import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";

function uploadBufferToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function uploadImage(req, res, next) {
  try {
    if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
      return res.status(500).json({ message: "Cloudinary is not configured" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const folder = req.body.folder || "phoenix/products";
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    res.status(201).json({
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    next(error);
  }
}