export const sampleProducts = [
  {
    _id: "sample-1",
    name: "Diet Supplement Blend",
    slug: "diet-supplement-blend",
    type: "Diet Supplement",
    shortDescription: "Sample product record ready to replace with database content.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80",
        alt: "Diet supplement product"
      }
    ],
    status: "active"
  },
  {
    _id: "sample-2",
    name: "Skin Care Base Ingredient",
    slug: "skin-care-base-ingredient",
    type: "Skin Care",
    shortDescription: "Sample skin care ingredient record ready to replace with database content.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=900&q=80",
        alt: "Skin care ingredient"
      }
    ],
    status: "active"
  }
];

export const sampleCategories = [
  { _id: "diet-supplement", name: "Diet Supplement", slug: "diet-supplement", sortOrder: 1 },
  { _id: "skin-care", name: "Skin Care", slug: "skin-care", sortOrder: 2 },
  { _id: "hair-care", name: "Hair Care", slug: "hair-care", sortOrder: 3 },
  { _id: "fruit-powders", name: "Fruit Powders", slug: "fruit-powders", sortOrder: 4 },
  { _id: "clays", name: "Clays", slug: "clays", sortOrder: 5 },
  { _id: "cosmetic-raw-materials", name: "Cosmetic Raw Materials", slug: "cosmetic-raw-materials", sortOrder: 6 },
  { _id: "salt-spices", name: "Salt & Spices", slug: "salt-spices", sortOrder: 7 },
  { _id: "processed-food-additives", name: "Processed Food Additives", slug: "processed-food-additives", sortOrder: 8 }
];

export const sampleCertificates = Array.from({ length: 9 }, (_, index) => ({
  _id: `certificate-${index + 1}`,
  title: `Certificate ${index + 1}`,
  image: {
    url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    alt: `Certificate ${index + 1}`
  },
  sortOrder: index + 1,
  status: "active"
}));



