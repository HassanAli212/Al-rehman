# Al Rehman Milking Machine — E-commerce Site

MERN stack e-commerce site for selling milking machines and spare parts.

## Structure
- `backend/` — Node/Express + MongoDB API (products, users/auth, orders)
- `frontend/` — React (Vite) + Tailwind CSS storefront + admin panel

## Setup

### Backend
```
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```
Runs on http://localhost:5000

### Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173 (proxies /api calls to the backend)

## Admin access
Admin has its own separate login, completely apart from the customer site —
no link to it appears anywhere in the normal storefront navbar.

1. Make sure your backend `.env` is set up and MongoDB is running.
2. From the `backend/` folder, run:
   ```
   npm run seed:admin
   ```
   This creates (or updates) the admin account with:
   - Email: `admin212@gmail.com`
   - Password: `admin123`
3. Go to `http://localhost:5173/admin/login` and sign in with those credentials.
   You'll land on the admin dashboard (`/admin`) with its own dark top bar and
   logout button — separate from the customer-facing site.

You can change the email/password by editing `backend/seed/seedAdmin.js` before
running the seed command, or by re-running it with new values. A non-admin
account cannot get into `/admin` — it redirects to `/admin/login`.

## What's built
- Homepage using your actual brand banner (blue/white diagonal design) as the hero
- Product catalog with categories (single/double bucket, portable, pipeline, spare parts)
- Product detail pages with specs
- Gallery page (auto-pulls product photos from the catalog)
- About Us and Contact pages (contact form sends via WhatsApp to 0308-4590379)
- Floating WhatsApp button on every page
- Cart (persisted in localStorage) + checkout with COD/JazzCash/EasyPaisa/Card options
- User auth (register/login, JWT)
- Order history for customers
- Separate Admin Portal (`/admin/login`, no public link) — add/delete products, update order status

## Still to add (next steps)
- Image upload (currently image URLs are entered manually — hook up Cloudinary or S3)
- Real payment gateway integration (JazzCash/EasyPaisa/Stripe APIs)
- Product reviews/ratings
- Email notifications on order placement
