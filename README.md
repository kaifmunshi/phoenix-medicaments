# Phoenix Medicaments Website

Responsive product catalogue and business enquiry website for Phoenix Medicaments.

## Goal

Build a production-ready website for a company that:

- Provides packaging and labelling services for products.
- Sells medicinal/product catalogue items such as powders and related products.
- Shows 200-300 products with images, details, product types, certificates, and enquiry options.
- Lets customers click "Talk to Business" from a product and open WhatsApp with a pre-filled requirement message.

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: MongoDB planned for products, categories, certificates, and enquiries
- Images: Cloudinary for product and certificate image hosting
- Hosting: Hostinger plan for `phoenixmedicaments.com`
- Source control: GitHub account `kaifmunshi`

## Local Folder Structure

```text
phoenix-medicaments/
  client/        React website
  server/        Express API
  docs/          planning, deployment notes, API notes
  README.md
```

## Core Features

1. Product catalogue
   - Product type dropdown and filtering
   - Infinite loading with 15 products per API call
   - Product images loaded from Cloudinary
   - Product details page or detail drawer

2. Business enquiry
   - WhatsApp button on every product
   - Pre-filled message with product name and customer requirement
   - Configurable business phone number from environment variables

3. Packaging and labelling service pages
   - Company packaging services
   - Labelling capabilities
   - Product/company enquiry CTA

4. Certificate section
   - 8-9 certificate images
   - Stored in Cloudinary
   - Optimized responsive display

5. Performance
   - Pagination/infinite scroll using `limit=15`
   - Lazy-loaded images
   - Responsive layout
   - API caching headers where useful
   - Database indexes on product type, slug, and search fields

## Deployment Direction

Hostinger shared hosting commonly supports PHP/static hosting, while Node.js support depends on the exact plan. We will first build locally in a way that can deploy cleanly in either of these paths:

- Preferred if Hostinger Node support is available: deploy React build plus Express API on Hostinger.
- If only shared hosting is available: deploy React static build on Hostinger and host the Express API separately on Render/Railway/VPS, then connect the domain/subdomain.

The code will keep `client` and `server` separated so deployment stays flexible.

## Environment Variables

Create these later in `server/.env`:

```env
PORT=5000
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WHATSAPP_BUSINESS_NUMBER=
CLIENT_URL=http://localhost:5173
```

Create these later in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_BUSINESS_NUMBER=
```

## First Local Steps

1. Initialize Git in this folder.
2. Create the React frontend in `client`.
3. Create the Express backend in `server`.
4. Add product/category API routes with pagination.
5. Add Cloudinary config placeholders.
6. Add MongoDB models.
7. Build responsive homepage, product listing, certificates, about, and contact sections.
8. Push to GitHub under `kaifmunshi`.
9. Deploy once local version is stable.

## Notes

- Product images should not be stored in GitHub. Store them in Cloudinary and save only URLs/public IDs in the database.
- For 200-300 products, avoid loading everything at once. Use `GET /api/products?type=powder&page=1&limit=15`.
- Product type mapping should be database-driven so new types can be added later without changing frontend code.
- WhatsApp links should be generated from product data and business phone number.
