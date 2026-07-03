import { env } from "../config/env.js";

export function requireAdmin(req, res, next) {
  if (!env.adminApiKey) {
    return res.status(500).json({ message: "ADMIN_API_KEY is not configured" });
  }

  const authHeader = req.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const providedKey = req.get("x-admin-key") || bearerToken;

  if (providedKey !== env.adminApiKey) {
    return res.status(401).json({ message: "Admin access required" });
  }

  next();
}