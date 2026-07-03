import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is empty. API will start, but database routes need MongoDB.");
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
}

