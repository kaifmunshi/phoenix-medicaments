import dns from "node:dns/promises";
import express from "express";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const router = express.Router();
const SMTP_ATTEMPTS = 3;

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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function buildMailContent({ name, number, requirement, safeName, safeNumber, safeRequirement }) {
  return {
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
  };
}

async function getSmtpHostAddress() {
  if (env.smtp.hostAddress) return env.smtp.hostAddress;
  const [address] = await dns.resolve4(env.smtp.host);
  return address;
}

async function sendWithSmtpOnce(mail, smtpHostAddress) {
  const transporter = nodemailer.createTransport({
    host: smtpHostAddress,
    port: env.smtp.port,
    secure: env.smtp.secure,
    family: 4,
    requireTLS: env.smtp.port === 587,
    tls: { servername: env.smtp.host },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 25000,
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
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    }),
    25000,
    "Contact mail server timed out."
  );
}

async function sendWithSmtp(mail) {
  const smtpHostAddress = await getSmtpHostAddress();
  let lastError;

  for (let attempt = 1; attempt <= SMTP_ATTEMPTS; attempt += 1) {
    try {
      console.info(`SMTP send attempt ${attempt}/${SMTP_ATTEMPTS} via ${env.smtp.host}:${env.smtp.port} (${smtpHostAddress})`);
      await sendWithSmtpOnce(mail, smtpHostAddress);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`SMTP send attempt ${attempt}/${SMTP_ATTEMPTS} failed: ${error.code || error.message}`);
      if (attempt < SMTP_ATTEMPTS) await wait(1500 * attempt);
    }
  }

  throw lastError;
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

    const mail = buildMailContent({ name, number, requirement, safeName, safeNumber, safeRequirement });
    await sendWithSmtp(mail);

    return res.json({ message: "Enquiry sent successfully." });
  } catch (error) {
    return next(error);
  }
});

export default router;
