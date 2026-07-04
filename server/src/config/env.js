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
  mail: {
    apiKey: process.env.BREVO_API_KEY || "",
    fromEmail: process.env.MAIL_FROM || "",
    fromName: process.env.MAIL_FROM_NAME || "Phoenix Medicaments",
    replyTo: process.env.MAIL_REPLY_TO || process.env.MAIL_FROM || "",
    to: process.env.CONTACT_NOTIFICATION_EMAIL || "phoenix.mbherbals.azim@gmail.com"
  }
};

