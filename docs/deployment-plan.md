# Deployment Plan

## Current Hostinger Details

- Domain: `phoenixmedicaments.com`
- Website IP: `191.96.56.115`
- Upload path: `public_html`
- Disk space: 10 GB
- RAM: 1024 MB
- CPU cores: 1
- Bandwidth: 100 GB

## Recommended Architecture

Use a separated app structure:

- `client`: public React website, built as static files.
- `server`: Node/Express API for products, certificates, categories, and enquiries.
- `admin-vue`: Vue admin dashboard shell for managing catalogue data later.

## Hostinger Deployment Options

### Option A: Hostinger Supports Node.js

1. Build React: `npm run build --workspace client`
2. Upload `client/dist` contents to `public_html`
3. Deploy `server` as a Node app in Hostinger
4. Set environment variables in Hostinger
5. Point frontend API URL to the deployed API URL

### Option B: Hostinger Is Shared Static Hosting Only

1. Build React and upload `client/dist` contents to `public_html`
2. Host `server` API on Render, Railway, VPS, or Hostinger VPS
3. Use `api.phoenixmedicaments.com` for the backend
4. Keep Cloudinary for all images and MongoDB Atlas for database

This option is often smoother for shared hosting plans.

## Database

Use MongoDB Atlas unless Hostinger gives a managed database that fits Node/Mongoose well.

Important indexes:

- Product slug
- Product type
- Product status
- Product name search

## Images

Use Cloudinary for:

- Product images
- Certificate images
- Service/gallery images

Store only Cloudinary `public_id`, secure URL, alt text, width, and height in MongoDB.

## GitHub

Suggested repository:

```text
https://github.com/kaifmunshi/phoenix-medicaments
```

Initial push flow:

```bash
git init
git add .
git commit -m "Initial Phoenix Medicaments app scaffold"
git branch -M main
git remote add origin https://github.com/kaifmunshi/phoenix-medicaments.git
git push -u origin main
```

