<script setup>
import { computed, onMounted, reactive, ref } from "vue";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const categories = ["Diet Supplement", "Skin Care", "Hair Care", "Fruit Powders", "Clays", "Cosmetic Raw Materials", "Salt & Spices", "Processed Food Additives"];

function emptyProduct() {
  return { name: "", type: "Diet Supplement", botanicalName: "", form: "", shelfLife: "24 months", imageUrl: "", publicId: "", alt: "", status: "active", sortOrder: 1 };
}

function emptyCertificate() {
  return { title: "", imageUrl: "", publicId: "", alt: "", status: "active", sortOrder: 1 };
}

const activeModule = ref("products");
const adminToken = ref(localStorage.getItem("phoenixAdminToken") || "");
const adminUser = ref(localStorage.getItem("phoenixAdminUser") || "");
const loginForm = reactive({ username: "", password: "" });
const isLoggingIn = ref(false);
const products = ref([]);
const certificates = ref([]);
const productForm = reactive(emptyProduct());
const certificateForm = reactive(emptyCertificate());
const isLoading = ref(false);
const isSaving = ref(false);
const isUploadingProduct = ref(false);
const isUploadingCertificate = ref(false);
const selectedProductImageName = ref("");
const selectedCertificateImageName = ref("");
const message = ref("");
const error = ref("");
const pageSize = 10;
const productPage = ref(1);
const productTotal = ref(0);
const productHasMore = ref(false);
const certificatePage = ref(1);
const certificateTotal = ref(0);
const certificateHasMore = ref(false);
const confirmDialog = reactive({ isOpen: false, type: "", item: null, title: "", message: "", isDeleting: false });

const isAuthenticated = computed(() => Boolean(adminToken.value.trim()));
const canSaveProduct = computed(() => isAuthenticated.value && productForm.name.trim() && productForm.type.trim());
const canSaveCertificate = computed(() => isAuthenticated.value && certificateForm.title.trim() && certificateForm.imageUrl.trim());

function resetProductForm() { Object.assign(productForm, emptyProduct()); selectedProductImageName.value = ""; }
function resetCertificateForm() { Object.assign(certificateForm, emptyCertificate()); selectedCertificateImageName.value = ""; }
function headers() { return { "Content-Type": "application/json", Authorization: `Bearer ${adminToken.value.trim()}`, "ngrok-skip-browser-warning": "true" }; }

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function uploadImage(event, target) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!isAuthenticated.value) { error.value = "Please login before uploading images."; event.target.value = ""; return; }

  const isCertificate = target === "certificate";
  const folder = isCertificate ? "phoenix/certificates" : "phoenix/products";
  const form = isCertificate ? certificateForm : productForm;
  const uploading = isCertificate ? isUploadingCertificate : isUploadingProduct;

  if (isCertificate) selectedCertificateImageName.value = file.name;
  else selectedProductImageName.value = file.name;

  uploading.value = true;
  message.value = "";
  error.value = "";

  const body = new FormData();
  body.append("image", file);
  body.append("folder", folder);

  try {
    const response = await fetch(`${API_URL}/admin/uploads`, { method: "POST", headers: { Authorization: `Bearer ${adminToken.value.trim()}`, "ngrok-skip-browser-warning": "true" }, body });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Image upload failed");
    form.imageUrl = data.image.url;
    form.publicId = data.image.publicId;
    if (!form.alt) form.alt = (isCertificate ? certificateForm.title : productForm.name) || file.name.replace(/\.[^.]+$/, "");
    message.value = "Image uploaded to Cloudinary.";
  } catch (err) {
    error.value = err.message;
  } finally {
    uploading.value = false;
    event.target.value = "";
  }
}

async function loadProducts(page = productPage.value) {
  if (!isAuthenticated.value) return;
  isLoading.value = true;
  error.value = "";
  try {
    const data = await request(`/admin/products?page=${page}&limit=${pageSize}`);
    products.value = data.items || [];
    productPage.value = data.page || page;
    productTotal.value = data.total || 0;
    productHasMore.value = Boolean(data.hasMore);
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

async function loadCertificates(page = certificatePage.value) {
  if (!isAuthenticated.value) return;
  isLoading.value = true;
  error.value = "";
  try {
    const data = await request(`/admin/certificates?page=${page}&limit=${pageSize}`);
    certificates.value = data.items || [];
    certificatePage.value = data.page || page;
    certificateTotal.value = data.total || 0;
    certificateHasMore.value = Boolean(data.hasMore);
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

async function loginAdmin() {
  if (!loginForm.username.trim() || !loginForm.password) return;
  isLoggingIn.value = true;
  message.value = "";
  error.value = "";

  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
      body: JSON.stringify({ username: loginForm.username.trim(), password: loginForm.password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Login failed");

    adminToken.value = data.token;
    adminUser.value = data.username || loginForm.username.trim();
    localStorage.setItem("phoenixAdminToken", adminToken.value);
    localStorage.setItem("phoenixAdminUser", adminUser.value);
    loginForm.password = "";
    message.value = "Login successful.";
    await loadProducts();
    await loadCertificates();
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoggingIn.value = false;
  }
}

function logoutAdmin() {
  adminToken.value = "";
  adminUser.value = "";
  products.value = [];
  certificates.value = [];
  localStorage.removeItem("phoenixAdminToken");
  localStorage.removeItem("phoenixAdminUser");
  message.value = "Logged out.";
  error.value = "";
}

async function addProduct() {
  if (!canSaveProduct.value) return;
  isSaving.value = true; message.value = ""; error.value = "";
  const images = productForm.imageUrl.trim() ? [{ url: productForm.imageUrl.trim(), publicId: productForm.publicId.trim(), alt: productForm.name.trim() }] : [];
  try {
    await request("/admin/products", { method: "POST", body: JSON.stringify({ name: productForm.name, type: productForm.type, botanicalName: productForm.botanicalName, form: productForm.form, shelfLife: productForm.shelfLife, images, status: productForm.status, sortOrder: Number(productForm.sortOrder || 0) }) });
    message.value = "Product added successfully."; resetProductForm(); await loadProducts(1);
  } catch (err) { error.value = err.message; }
  finally { isSaving.value = false; }
}

async function addCertificate() {
  if (!canSaveCertificate.value) return;
  isSaving.value = true; message.value = ""; error.value = "";
  try {
    await request("/admin/certificates", { method: "POST", body: JSON.stringify({ title: certificateForm.title, image: { url: certificateForm.imageUrl.trim(), publicId: certificateForm.publicId.trim(), alt: certificateForm.title.trim() }, status: certificateForm.status, sortOrder: Number(certificateForm.sortOrder || 0) }) });
    message.value = "Certificate added successfully."; resetCertificateForm(); await loadCertificates(1);
  } catch (err) { error.value = err.message; }
  finally { isSaving.value = false; }
}

function askDeleteProduct(product) {
  confirmDialog.isOpen = true;
  confirmDialog.type = "product";
  confirmDialog.item = product;
  confirmDialog.title = "Delete product?";
  confirmDialog.message = `This will permanently delete ${product.name} from the database.`;
}

function askDeleteCertificate(certificate) {
  confirmDialog.isOpen = true;
  confirmDialog.type = "certificate";
  confirmDialog.item = certificate;
  confirmDialog.title = "Delete certificate?";
  confirmDialog.message = `This will permanently delete ${certificate.title} from the database.`;
}

function resetConfirmDialog() {
  confirmDialog.isOpen = false;
  confirmDialog.type = "";
  confirmDialog.item = null;
  confirmDialog.title = "";
  confirmDialog.message = "";
}

function closeConfirmDialog() {
  if (confirmDialog.isDeleting) return;
  resetConfirmDialog();
}

async function confirmDelete() {
  if (!confirmDialog.item) return;
  confirmDialog.isDeleting = true;
  error.value = "";
  message.value = "";

  try {
    if (confirmDialog.type === "product") {
      await request(`/admin/products/${confirmDialog.item._id}`, { method: "DELETE" });
      message.value = "Product deleted successfully.";
      resetConfirmDialog();
      await loadProducts(products.value.length === 1 && productPage.value > 1 ? productPage.value - 1 : productPage.value);
    } else {
      await request(`/admin/certificates/${confirmDialog.item._id}`, { method: "DELETE" });
      message.value = "Certificate deleted successfully.";
      resetConfirmDialog();
      await loadCertificates(certificates.value.length === 1 && certificatePage.value > 1 ? certificatePage.value - 1 : certificatePage.value);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    confirmDialog.isDeleting = false;
  }
}
function switchModule(module) { activeModule.value = module; if (module === "products") loadProducts(); if (module === "certificates") loadCertificates(); }

onMounted(() => { if (isAuthenticated.value) { loadProducts(); loadCertificates(); } });
</script>

<template>
  <main v-if="!isAuthenticated" class="login-page">
    <form class="login-panel" @submit.prevent="loginAdmin">
      <div>
        <p>Secure admin access</p>
        <h2>Phoenix Admin</h2>
      </div>
      <div class="notice" v-if="message">{{ message }}</div>
      <div class="error" v-if="error">{{ error }}</div>
      <label><span>Username</span><input v-model="loginForm.username" autocomplete="username" required placeholder="admin" /></label>
      <label><span>Password</span><input v-model="loginForm.password" autocomplete="current-password" required type="password" placeholder="Enter password" /></label>
      <button class="primary" type="submit" :disabled="isLoggingIn || !loginForm.username.trim() || !loginForm.password">{{ isLoggingIn ? "Logging in..." : "Login" }}</button>
    </form>
  </main>

  <main v-else>
    <aside>
      <h1>Phoenix Admin</h1>
      <button :class="{ active: activeModule === 'products' }" type="button" @click="switchModule('products')">Products</button>
      <button :class="{ active: activeModule === 'certificates' }" type="button" @click="switchModule('certificates')">Certificates</button>
      <div class="admin-session"><span>{{ adminUser }}</span><button class="ghost" type="button" @click="logoutAdmin">Logout</button></div>
    </aside>

    <section class="workspace">
      <div class="topbar">
        <div>
          <p>{{ activeModule === 'products' ? 'Catalogue management' : 'Certificate management' }}</p>
          <h2>{{ activeModule === 'products' ? 'Add products with direct Cloudinary uploads.' : 'Upload certificates with heading and image.' }}</h2>
        </div>
        <button class="ghost" type="button" @click="activeModule === 'products' ? loadProducts() : loadCertificates()" :disabled="isLoading || !isAuthenticated">{{ isLoading ? "Loading..." : "Refresh" }}</button>
      </div>

      <div class="notice" v-if="message">{{ message }}</div>
      <div class="error" v-if="error">{{ error }}</div>


      <form v-if="activeModule === 'products'" class="panel form-grid" @submit.prevent="addProduct">
        <label><span>Name</span><input v-model="productForm.name" required placeholder="Amla Powder" /></label>
        <label><span>Category / type</span><select v-model="productForm.type" required><option v-for="category in categories" :key="category" :value="category">{{ category }}</option></select></label>
        <label><span>Botanical name</span><input v-model="productForm.botanicalName" placeholder="Phyllanthus emblica" /></label>
        <label><span>Form</span><input v-model="productForm.form" placeholder="Fine powder" /></label>
        <label><span>Shelf life</span><input v-model="productForm.shelfLife" placeholder="24 months" /></label>        <div class="wide upload-box"><label><span>Upload product image</span><input type="file" accept="image/*" @change="uploadImage($event, 'product')" :disabled="isUploadingProduct || !isAuthenticated" /></label><div class="upload-status"><strong>{{ isUploadingProduct ? "Uploading to Cloudinary..." : selectedProductImageName || "Choose an image from your computer" }}</strong><small>Cloudinary URL and public ID will fill automatically.</small></div><img v-if="productForm.imageUrl" class="image-preview" :src="productForm.imageUrl" :alt="productForm.alt || productForm.name" /></div>
        <label class="wide"><span>Cloudinary image URL</span><input v-model="productForm.imageUrl" /></label>
        <label><span>Cloudinary public ID</span><input v-model="productForm.publicId" /></label>        <button class="primary wide" type="submit" :disabled="!canSaveProduct || isSaving">{{ isSaving ? "Saving..." : "Add product" }}</button>
      </form>

      <form v-if="activeModule === 'certificates'" class="panel form-grid" @submit.prevent="addCertificate">
        <label class="wide"><span>Certificate heading</span><input v-model="certificateForm.title" required placeholder="FSSAI Certificate" /></label>        <div class="wide upload-box"><label><span>Upload certificate image</span><input type="file" accept="image/*" @change="uploadImage($event, 'certificate')" :disabled="isUploadingCertificate || !isAuthenticated" /></label><div class="upload-status"><strong>{{ isUploadingCertificate ? "Uploading to Cloudinary..." : selectedCertificateImageName || "Choose a certificate image" }}</strong><small>Saved under phoenix/certificates in Cloudinary.</small></div><img v-if="certificateForm.imageUrl" class="image-preview certificate-preview" :src="certificateForm.imageUrl" :alt="certificateForm.alt || certificateForm.title" /></div>
        <label class="wide"><span>Cloudinary image URL</span><input v-model="certificateForm.imageUrl" /></label>
        <label class="wide"><span>Cloudinary public ID</span><input v-model="certificateForm.publicId" /></label>
        <button class="primary wide" type="submit" :disabled="!canSaveCertificate || isSaving">{{ isSaving ? "Saving..." : "Add certificate" }}</button>
      </form>

      <div v-if="activeModule === 'products'" class="panel list-panel">
        <div class="list-head"><h3>Products in database</h3><span>{{ products.length }} of {{ productTotal }} shown</span></div>
        <div class="empty" v-if="!products.length && !isLoading">No products loaded yet.</div>
        <article class="product-row" v-for="product in products" :key="product._id"><img :src="product.images?.[0]?.url || ''" :alt="product.images?.[0]?.alt || product.name" /><div><strong>{{ product.name }}</strong><small>{{ product.type }} · {{ product.botanicalName || 'No botanical name' }}</small></div><span class="status">{{ product.status }}</span><button class="danger" type="button" @click="askDeleteProduct(product)">Delete</button></article>
        <div class="pagination" v-if="productTotal > pageSize">
          <button class="ghost" type="button" @click="loadProducts(productPage - 1)" :disabled="isLoading || productPage <= 1">Previous</button>
          <span>Page {{ productPage }}</span>
          <button class="ghost" type="button" @click="loadProducts(productPage + 1)" :disabled="isLoading || !productHasMore">Next</button>
        </div>
      </div>
      <div v-if="activeModule === 'certificates'" class="panel list-panel">
        <div class="list-head"><h3>Certificates in database</h3><span>{{ certificates.length }} of {{ certificateTotal }} shown</span></div>
        <div class="empty" v-if="!certificates.length && !isLoading">No certificates loaded yet.</div>
        <article class="product-row" v-for="certificate in certificates" :key="certificate._id"><img :src="certificate.image?.url || ''" :alt="certificate.image?.alt || certificate.title" /><div><strong>{{ certificate.title }}</strong><small>{{ certificate.image?.publicId || 'No public ID' }}</small></div><span class="status">{{ certificate.status }}</span><button class="danger" type="button" @click="askDeleteCertificate(certificate)">Delete</button></article>
        <div class="pagination" v-if="certificateTotal > pageSize">
          <button class="ghost" type="button" @click="loadCertificates(certificatePage - 1)" :disabled="isLoading || certificatePage <= 1">Previous</button>
          <span>Page {{ certificatePage }}</span>
          <button class="ghost" type="button" @click="loadCertificates(certificatePage + 1)" :disabled="isLoading || !certificateHasMore">Next</button>
        </div>
      </div>
      <div class="confirm-backdrop" v-if="confirmDialog.isOpen" role="presentation" @click="closeConfirmDialog">
        <section class="confirm-dialog" role="dialog" aria-modal="true" :aria-label="confirmDialog.title" @click.stop>
          <h3>{{ confirmDialog.title }}</h3>
          <p>{{ confirmDialog.message }}</p>
          <div class="confirm-actions">
            <button class="ghost" type="button" @click="closeConfirmDialog" :disabled="confirmDialog.isDeleting">Cancel</button>
            <button class="danger" type="button" @click="confirmDelete" :disabled="confirmDialog.isDeleting">{{ confirmDialog.isDeleting ? "Deleting..." : "Delete" }}</button>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
