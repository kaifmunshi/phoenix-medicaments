const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let warmApiPromise;
let prewarmDataPromise;

export function warmApi() {
  if (!warmApiPromise) {
    warmApiPromise = fetch(`${API_URL}/health`, { cache: "no-store" })
      .catch(() => {
        // The visible pages handle API errors when data is requested.
      });
  }

  return warmApiPromise;
}

export function prewarmApiData() {
  if (!prewarmDataPromise) {
    prewarmDataPromise = warmApi()
      .then(() => Promise.allSettled([
        fetchProducts({ page: 1, limit: 1 }),
        fetchProducts({ type: "Skin Care", page: 1, limit: 12 }),
        fetchCertificates()
      ]))
      .catch(() => {
        // Prefetch is only a speed-up. Pages still fetch their own data.
      });
  }

  return prewarmDataPromise;
}

export async function fetchProducts({ type = "", page = 1, limit = 15 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (type) params.set("type", type);

  const response = await fetch(`${API_URL}/products?${params.toString()}`);
  if (!response.ok) throw new Error("Products request failed");
  return response.json();
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error("Categories request failed");
    return response.json();
  } catch {
    return {
      items: [
        { _id: "diet-supplement", name: "Diet Supplement", slug: "diet-supplement" },
        { _id: "skin-care", name: "Skin Care", slug: "skin-care" },
        { _id: "hair-care", name: "Hair Care", slug: "hair-care" },
        { _id: "fruit-powders", name: "Fruit Powders", slug: "fruit-powders" },
        { _id: "clays", name: "Clays", slug: "clays" },
        { _id: "cosmetic-raw-materials", name: "Cosmetic Raw Materials", slug: "cosmetic-raw-materials" },
        { _id: "salt-spices", name: "Salt & Spices", slug: "salt-spices" },
        { _id: "processed-food-additives", name: "Processed Food Additives", slug: "processed-food-additives" }
      ]
    };
  }
}


export async function fetchCertificates() {
  try {
    const response = await fetch(`${API_URL}/certificates`);
    if (!response.ok) throw new Error("Certificates request failed");
    return response.json();
  } catch {
    return { items: [] };
  }
}

export async function sendContactEnquiry(payload) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Could not send enquiry");
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The mail service is taking too long. Please send your requirement on WhatsApp.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

