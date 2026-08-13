# Al Rehman Milking Machine — E-commerce Website

A modern full-stack MERN e-commerce website developed for **Al Rehman Milking Machine**, a dairy equipment business specializing in milking machines, spare parts, and dairy essentials.

The platform includes a customer-facing storefront, product catalog, shopping cart, checkout and order management, along with a separate admin dashboard for managing products and orders.

---

## 🚀 Live Project

**Frontend:** Add your live website URL here

**Backend API:** Add your deployed backend URL here

---

## 📌 Project Overview

Al Rehman Milking Machine is a responsive e-commerce platform built with the MERN stack.

Customers can:

* Browse milking machines and dairy products
* Filter products by category
* Search products
* View detailed product information
* View product images and videos
* Add products to cart
* Update cart quantities
* Place orders
* Select payment methods
* View their order information
* Contact the business through WhatsApp

Administrators can:

* Login through a separate admin portal
* Add products
* Edit products
* Delete products
* Upload multiple product images
* Manage product stock
* View customer orders
* Update order status
* Monitor revenue and order statistics
* Monitor low-stock products

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS
* Framer Motion
* Axios
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Multer

### Cloud & Services

* MongoDB Atlas
* Cloudinary
* WhatsApp
* GitHub

---

## ✨ Features

### 🛍️ Customer Storefront

* Responsive homepage
* Product catalog
* Product categories
* Product search
* Product detail pages
* Product image gallery
* Product video support
* Shopping cart
* Persistent cart using localStorage
* Checkout
* Customer authentication
* Order history
* WhatsApp contact integration

### 📦 Product Categories

The catalog supports:

* Single Bucket
* Double Bucket
* Pipeline
* Spare Parts
* Dairy Essentials
* Other

---

## 🛒 Shopping Cart

The cart provides:

* Add to cart
* Remove from cart
* Increase/decrease quantity
* Automatic item price calculation
* Shipping calculation
* Total price calculation
* Persistent cart using browser localStorage

### Shipping Logic

Orders above **Rs 50,000** receive free shipping.

Orders below Rs 50,000 have a shipping charge of **Rs 1,500**.

---

## 💳 Checkout

The checkout system collects:

* Full Name
* Phone Number
* Street Address
* City
* Province
* Postal Code
* Payment Method

Supported payment method options include:

* Cash on Delivery
* JazzCash
* EasyPaisa
* Card

> Payment gateway API integration can be added separately for online payment processing.

---

## 🔐 Authentication

The application uses JWT-based authentication.

### Customer Authentication

Customers can:

* Register
* Login
* Logout
* Access their orders

### Admin Authentication

The admin dashboard has a separate login system.

Admin routes are protected and require an authenticated administrator account.

The admin portal is available at:

```text
/admin/login
```

The normal customer navbar does not expose a public admin link.

---

## 👨‍💼 Admin Dashboard

The admin dashboard provides three main sections:

### Overview

Displays:

* Total Revenue
* Total Orders
* Pending Orders
* Total Products
* Low-stock products
* Recent orders

### Product Management

Administrators can:

* Add products
* Edit products
* Delete products
* Upload multiple images
* Remove uploaded images
* Set product prices
* Set product stock
* Select product categories
* Add product descriptions
* Add product video URLs

### Order Management

Administrators can:

* View customer orders
* View customer contact information
* View delivery address
* View ordered products
* View order totals
* Update order status

Available order statuses:

```text
pending
processing
shipped
delivered
cancelled
```

---

## ☁️ Cloudinary Image Storage

Product images are uploaded through the backend and stored using **Cloudinary**.

The backend receives the uploaded image and returns the Cloudinary URL to the frontend.

Product image URLs are then stored with the product data in MongoDB.

This avoids relying on temporary local storage when the application is deployed.

---

## 🗄️ Database

The project uses **MongoDB** with Mongoose.

Main data areas include:

* Users
* Products
* Orders

For production deployment, MongoDB Atlas can be used as the cloud database.

---

## 📱 Responsive Design

The website is designed to work across:

* Mobile phones
* Tablets
* Laptops
* Desktop computers

The admin dashboard is also optimized for mobile screens.

Responsive improvements include:

* Mobile navigation
* Responsive product cards
* Responsive order cards
* Mobile-friendly checkout
* Responsive image galleries
* Mobile admin dashboard
* Responsive buttons and forms
* Adaptive grid layouts

---

## 📂 Project Structure

```text
al-rehman-milking-machine/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   └── index.js
│   │
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# ⚙️ Local Development

## 1. Clone the Repository

```bash
git clone https://github.com/HassanAli212/Al-rehman.git
cd Al-rehman/al-rehman-milking-machine
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
```

Then start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

Never commit real secrets to GitHub.

The following values should be stored in `.env`:

```env
MONGO_URI=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=
```

The `.env` file should remain inside `.gitignore`.

---

# 👨‍💻 Admin Account

Create the admin account using the project's admin seed command if available:

```bash
npm run seed:admin
```

Do **not** publish real admin credentials in this README or in the GitHub repository.

For production, use a strong unique password and keep credentials in environment variables or another secure secret-management system.

---

# 🔌 API Overview

Main API areas include:

### Products

```text
GET    /api/products
GET    /api/products/:slug
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Authentication

```text
POST /api/auth/login
POST /api/auth/register
```

### Orders

```text
POST /api/orders
GET  /api/orders/my-orders
GET  /api/orders
PUT  /api/orders/:id/status
```

### Image Upload

```text
POST /api/upload
```

---

# 📦 Deployment

The application can be deployed using separate frontend and backend services.

Typical production architecture:

```text
                    ┌─────────────────┐
                    │   Customer      │
                    │    Browser      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Frontend     │
                    │ React + Vite    │
                    └────────┬────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌─────────────────┐
                    │     Backend     │
                    │ Node + Express  │
                    └───────┬─┬───────┘
                            │ │
                ┌───────────┘ └───────────┐
                ▼                         ▼
        ┌───────────────┐         ┌───────────────┐
        │ MongoDB Atlas │         │  Cloudinary   │
        │   Database    │         │    Images     │
        └───────────────┘         └───────────────┘
```

---

# 🔒 Security

Important security practices:

* JWT authentication
* Password hashing with bcrypt
* Protected admin routes
* Admin role authorization
* Environment variables for secrets
* `.env` excluded from Git
* Cloudinary credentials stored securely
* MongoDB credentials not committed to the repository

---

# 📸 Product Images

Product images are managed through the admin dashboard.

The administrator can:

1. Open the Admin Dashboard
2. Go to Products
3. Add or edit a product
4. Upload one or multiple images
5. Preview uploaded images
6. Save the product

Images are uploaded to Cloudinary and their URLs are stored with the product.

---

# 📱 WhatsApp Integration

The website includes WhatsApp integration for customer communication.

Customers can use the floating WhatsApp button to contact the business directly.

The Contact page also provides WhatsApp-based communication.

---

# 🧪 Development

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Build frontend for production:

```bash
cd frontend
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 📝 Future Improvements

Possible future enhancements:

* Online payment gateway integration
* Product reviews and ratings
* Email notifications
* WhatsApp order notifications
* Advanced analytics
* Product stock alerts
* Order invoice generation
* Customer profile management
* Coupon and discount system
* Advanced admin reporting
* Search engine optimization
* Automated deployment pipeline

---

# 👨‍💻 Developer

**Muhammad Hassan**

BS (Hons) Computer Science

GitHub:

```text
https://github.com/HassanAli212
```

---

## 📄 License

This project was developed for **Al Rehman Milking Machine**.

All rights reserved.
