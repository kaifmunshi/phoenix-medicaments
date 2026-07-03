import { env } from "../config/env.js";

export function buildWhatsAppUrl(product) {
  if (!env.whatsappBusinessNumber) return "";

  const message = [
    "Hello Phoenix Medicaments,",
    `I want to know more about: ${product.name}`,
    `Product type: ${product.type}`,
    "Please share price, availability, packaging, and minimum order details."
  ].join("\n");

  return `https://wa.me/${env.whatsappBusinessNumber}?text=${encodeURIComponent(message)}`;
}

