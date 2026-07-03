import slugify from "slugify";
import { connectDb } from "../config/db.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

const categories = [
  {
    name: "Diet Supplement",
    description: "Herbal wellness powders, nutraceutical ingredients, and dietary supplement materials for bulk and private-label supply.",
    sortOrder: 1
  },
  {
    name: "Skin Care",
    description: "Natural skincare powders and beauty ingredients for face packs, body care, and cosmetic formulations.",
    sortOrder: 2
  },
  {
    name: "Hair Care",
    description: "Herbal hair care ingredients for oils, masks, cleansing powders, and scalp care formulations.",
    sortOrder: 3
  },
  {
    name: "Fruit Powders",
    description: "Spray dried and dehydrated fruit powders for beverages, food formulations, and nutraceutical blends.",
    sortOrder: 4
  },
  {
    name: "Clays",
    description: "Cosmetic-grade clays and mineral powders for skincare, cleansing, and spa formulations.",
    sortOrder: 5
  },
  {
    name: "Cosmetic Raw Materials",
    description: "Cosmetic and personal care raw materials for skincare, hair care, and formulation support.",
    sortOrder: 6
  },
  {
    name: "Salt & Spices",
    description: "Food-grade salts, spices, and seasoning ingredients for culinary and processed food applications.",
    sortOrder: 7
  },
  {
    name: "Processed Food Additives",
    description: "Food additives and functional ingredients for processed foods, beverages, and industrial formulations.",
    sortOrder: 8
  }
];

const legacyTypeMap = new Map([
  ["Herbal Powder", "Diet Supplement"],
  ["Fruit Powder", "Fruit Powders"]
]);

function makeSlug(value) {
  return slugify(value, { lower: true, strict: true, trim: true });
}

await connectDb();

const activeSlugs = categories.map((category) => makeSlug(category.name));

for (const category of categories) {
  await Category.findOneAndUpdate(
    { slug: makeSlug(category.name) },
    { ...category, slug: makeSlug(category.name), status: "active" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

await Category.updateMany(
  { slug: { $nin: activeSlugs } },
  { status: "archived" }
);

for (const [fromType, toType] of legacyTypeMap.entries()) {
  await Product.updateMany({ type: fromType }, { type: toType });
}

console.log(`Seeded ${categories.length} categories and updated legacy product type mappings`);
process.exit(0);
