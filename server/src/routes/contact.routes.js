import express from "express";
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

async function sendWithBrevo(mail) {
  const response = await withTimeout(
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": env.mail.apiKey
      },
      body: JSON.stringify({
        sender: {
          name: env.mail.fromName,
          email: env.mail.fromEmail
        },
        to: [{ email: env.mail.to }],
        replyTo: {
          name: env.mail.fromName,
          email: env.mail.replyTo || env.mail.fromEmail
        },
        subject: mail.subject,
        textContent: mail.text,
        htmlContent: mail.html
      })
    }),
    18000,
    "Contact mail provider timed out."
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Brevo contact mail failed", data);
    throw new Error(data.message || "Contact mail provider rejected the request.");
  }
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

    if (!env.mail.apiKey || !env.mail.fromEmail || !env.mail.to) {
      return res.status(500).json({ message: "Contact email is not configured on the server." });
    }

    const mail = buildMailContent({ name, number, requirement, safeName, safeNumber, safeRequirement });
    await sendWithBrevo(mail);

    return res.json({ message: "Enquiry sent successfully." });
  } catch (error) {
    return next(error);
  }
});

export default router;
