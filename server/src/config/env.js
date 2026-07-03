import dotenv from "dotenv";

dotenv.config({ path: new URL("../../.env", import.meta.url) });
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5174",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || ""
  },
  whatsappBusinessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "",
  adminApiKey: process.env.ADMIN_API_KEY || "",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: (process.env.SMTP_PASS || "").replace(/\s/g, ""),
    from: process.env.MAIL_FROM || process.env.SMTP_USER || "",
    to: process.env.CONTACT_NOTIFICATION_EMAIL || "phoenixsalesahmedabad@gmail.com"
  }
};

