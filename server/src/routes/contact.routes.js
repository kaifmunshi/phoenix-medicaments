import dns from "node:dns";
import express from "express";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const router = express.Router();

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function lookupIpv4(hostname, options, callback) {
  return dns.lookup(hostname, { ...options, family: 4 }, callback);
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

router.post("/", async (req, res, next) => {
  try {
    const name = clean(req.body?.name);
    const number = clean(req.body?.number);
    const requirement = clean(req.body?.requirement);
    const safeName = escapeHtml(name);
    const safeNumber = escapeHtml(number);
    const safeRequirement = escapeHtml(requirement);

    if (!name || !number || !requirement) {
      return res.status(400).json({ message: "Name, number, and requirement are required." });
    }

    if (!env.smtp.host || !env.smtp.user || !env.smtp.pass || !env.smtp.to) {
      return res.status(500).json({ message: "Contact email is not configured on the server." });
    }

    const transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      family: 4,
      lookup: lookupIpv4,
      requireTLS: env.smtp.port === 587,
      tls: { servername: env.smtp.host },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    });

    await withTimeout(
      transporter.sendMail({
        from: env.smtp.from,
        to: env.smtp.to,
        replyTo: env.smtp.from,
        subject: `New website enquiry from ${name}`,
        text: [
          "New contact enquiry from Phoenix Medicaments website:",
          "",
          `Name: ${name}`,
          `Number: ${number}`,
          "",
          "Requirement:",
          requirement
        ].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0d1814">
            <h2 style="color:#113f33">New website enquiry</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Number:</strong> ${safeNumber}</p>
            <p><strong>Requirement:</strong></p>
            <p style="white-space:pre-line;background:#f2f8f3;padding:14px;border-radius:8px">${safeRequirement}</p>
          </div>
        `
      }),
      18000,
      "Contact mail server timed out."
    );

    return res.json({ message: "Enquiry sent successfully." });
  } catch (error) {
    return next(error);
  }
});

export default router;


