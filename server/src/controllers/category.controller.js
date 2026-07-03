import slugify from "slugify";
import { Category } from "../models/category.model.js";
import { env } from "../config/env.js";
import { sampleCategories } from "../data/sampleData.js";

function makeSlug(value) {
  return slugify(value || "", { lower: true, strict: true, trim: true });
}

function normalizeCategoryPayload(body) {
  const name = body.name?.trim();

  return {
    name,
    slug: body.slug ? makeSlug(body.slug) : makeSlug(name),
    description: body.description?.trim(),
    image: body.image,
    sortOrder: Number(body.sortOrder || 0),
    status: body.status || "active"
  };
}

export async function listCategories(_req, res, next) {
  try {
    if (!env.mongoUri) {
      return res.json({ items: sampleCategories });
    }

    const categories = await Category.find({ status: "active" }).sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ items: categories });
  } catch (error) {
    next(error);
  }
}

export async function adminListCategories(_req, res, next) {
  try {
    const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ items: categories });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateCategory(req, res, next) {
  try {
    const payload = normalizeCategoryPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create(payload);
    res.status(201).json({ item: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category slug already exists" });
    }
    next(error);
  }
}

export async function adminUpdateCategory(req, res, next) {
  try {
    const payload = normalizeCategoryPayload(req.body);
    const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ item: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category slug already exists" });
    }
    next(error);
  }
}

export async function adminDeleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { status: "archived" }, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ item: category });
  } catch (error) {
    next(error);
  }
}