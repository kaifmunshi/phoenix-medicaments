import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import certificateRoutes, { adminCertificateRouter } from "./routes/certificate.routes.js";
import categoryRoutes, { adminCategoryRouter } from "./routes/category.routes.js";
import productRoutes, { adminProductRouter } from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

app.use(helmet());
const allowedOrigins = [env.clientUrl, env.adminUrl].filter(Boolean);
const devTunnelHosts = [".trycloudflare.com", ".ngrok-free.dev"];

app.use(cors({
  origin(origin, callback) {
    const isAllowedDevTunnel = env.nodeEnv !== "production" && devTunnelHosts.some((host) => origin?.endsWith(host));
    const isAllowedLocalDev = env.nodeEnv !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");

    if (!origin || allowedOrigins.includes(origin) || isAllowedDevTunnel || isAllowedLocalDev) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.post("/api/admin/login", (req, res) => {
  if (!env.adminApiKey || !env.adminPassword) {
    return res.status(500).json({ message: "Admin login is not configured" });
  }

  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  if (username !== env.adminUsername || password !== env.adminPassword) {
    return res.status(401).json({ message: "Invalid admin username or password" });
  }

  res.json({ token: env.adminApiKey, username: env.adminUsername });
});
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "phoenix-api" });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/categories", adminCategoryRouter);
app.use("/api/admin/certificates", adminCertificateRouter);
app.use("/api/admin/uploads", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

export default app;

