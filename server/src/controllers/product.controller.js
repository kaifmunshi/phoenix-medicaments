import slugify from "slugify";
import { Product } from "../models/product.model.js";
import { env } from "../config/env.js";
import { buildWhatsAppUrl } from "../utils/whatsapp.js";

function makeSlug(value) {
  return slugify(value || "", { lower: true, strict: true, trim: true });
}

function normalizeProductPayload(body) {
  const name = body.name?.trim();
  const type = body.type?.trim();
  const form = body.form?.trim() || body.specifications?.form;
  const shelfLife = body.shelfLife?.trim() || body.specifications?.shelfLife;

  return {
    name,
    slug: body.slug ? makeSlug(body.slug) : makeSlug(name),
    category: body.category || undefined,
    type,
    botanicalName: body.botanicalName?.trim(),
    form,
    shelfLife,
    shortDescription: body.shortDescription?.trim(),
    description: body.description?.trim(),
    images: Array.isArray(body.images) ? body.images : [],
    specifications: {
      ...body.specifications,
      form,
      shelfLife
    },
    isFeatured: Boolean(body.isFeatured),
    sortOrder: Number(body.sortOrder || 0),
    status: body.status || "active"
  };
}

export async function listProducts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 15), 1), 30);
    const skip = (page - 1) * limit;

    if (!env.mongoUri) {
      return res.json({
        items: [],
        page,
        limit,
        total: 0,
        hasMore: false
      });
    }

    const filter = { status: "active" };

    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [items, total] = await Promise.all([
      Product.find(filter).populate("category", "name slug").sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ]);

    res.json({
      items: items.map((product) => ({
        ...product,
        whatsappUrl: buildWhatsAppUrl(product)
      })),
      page,
      limit,
      total,
      hasMore: skip + items.length < total
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    if (!env.mongoUri) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findOne({ slug: req.params.slug, status: "active" }).populate("category", "name slug").lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ...product,
      whatsappUrl: buildWhatsAppUrl(product)
    });
  } catch (error) {
    next(error);
  }
}

export async function adminListProducts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [items, total] = await Promise.all([
      Product.find(filter).populate("category", "name slug").sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, hasMore: skip + items.length < total });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateProduct(req, res, next) {
  try {
    const payload = normalizeProductPayload(req.body);

    if (!payload.name || !payload.type) {
      return res.status(400).json({ message: "Product name and type are required" });
    }

    const product = await Product.create(payload);
    res.status(201).json({ item: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Product slug already exists" });
    }
    next(error);
  }
}

export async function adminUpdateProduct(req, res, next) {
  try {
    const payload = normalizeProductPayload(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ item: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Product slug already exists" });
    }
    next(error);
  }
}

export async function adminDeleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ item: product });
  } catch (error) {
    next(error);
  }
}