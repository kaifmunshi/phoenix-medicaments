import { Certificate } from "../models/certificate.model.js";
import { env } from "../config/env.js";
import { sampleCertificates } from "../data/sampleData.js";

function normalizeCertificatePayload(body) {
  return {
    title: body.title?.trim(),
    image: body.image,
    sortOrder: Number(body.sortOrder || 0),
    status: body.status || "active"
  };
}

export async function listCertificates(_req, res, next) {
  try {
    if (!env.mongoUri) {
      return res.json({ items: sampleCertificates });
    }

    const certificates = await Certificate.find({ status: "active" }).sort({ sortOrder: 1 }).lean();
    res.json({ items: certificates });
  } catch (error) {
    next(error);
  }
}

export async function adminListCertificates(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Certificate.find({}).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Certificate.countDocuments({})
    ]);

    res.json({ items, page, limit, total, hasMore: skip + items.length < total });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateCertificate(req, res, next) {
  try {
    const payload = normalizeCertificatePayload(req.body);

    if (!payload.title || !payload.image?.url) {
      return res.status(400).json({ message: "Certificate title and image.url are required" });
    }

    const certificate = await Certificate.create(payload);
    res.status(201).json({ item: certificate });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateCertificate(req, res, next) {
  try {
    const payload = normalizeCertificatePayload(req.body);
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ item: certificate });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteCertificate(req, res, next) {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ item: certificate });
  } catch (error) {
    next(error);
  }
}