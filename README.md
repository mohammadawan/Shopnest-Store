# 🛒 ShopNest — Amazon-Style MERN eCommerce

A full-stack production-level eCommerce application built with the MERN stack, inspired by Amazon's design and functionality.

---

## 📁 Folder Structure

```
ecommerce/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/      # Reusable UI (Button, Modal, Skeleton, etc.)
│       │   ├── layout/      # Navbar, Footer, Sidebar
│       │   ├── home/        # Hero, Categories, FlashSale, etc.
│       │   ├── product/     # ProductCard, ProductGallery, Reviews
│       │   ├── cart/        # CartItem, CartSummary
│       │   ├── auth/        # LoginForm, SignupForm
│       │   ├── admin/       # Admin dashboard components
│       │   └── user/        # Profile, OrderHistory, Wishlist
│       ├── pages/
│       │   ├── auth/        # LoginPage, SignupPage, ForgotPassword
│       │   ├── user/        # ProfilePage, OrdersPage, WishlistPage
│       │   └── admin/       # AdminDashboard, Products, Users, Orders
│       ├── redux/
│       │   └── slices/      # authSlice, cartSlice, productSlice, etc.
│       ├── hooks/           # Custom hooks
│       └── utils/           # Helper functions, axios config
│
└── server/                  # Node.js + Express backend
    ├── config/              # DB connection, Cloudinary config
    ├── controllers/         # Business logic
    ├── middleware/          # Auth, error handling, upload
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    └── utils/               # Email, token helpers
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo
```bash
git clone <your-repo>
cd ecommerce
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
# Fill in your .env values
npm start
```

---

## 🔐 Environment Variables

### server/.env
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopnest
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### client/.env
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your_cloud_name
```

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout |
| GET  | /api/auth/me | Get current user |
| PUT  | /api/auth/password | Change password |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product (Admin) |
| PUT | /api/products/:id | Update product (Admin) |
| DELETE | /api/products/:id | Delete product (Admin) |

### Cart
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/cart | Get user cart |
| POST | /api/cart | Add to cart |
| PUT | /api/cart/:itemId | Update quantity |
| DELETE | /api/cart/:itemId | Remove item |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/orders | Place order |
| GET | /api/orders/my | Get user orders |
| GET | /api/orders/:id | Get order details |
| GET | /api/orders | Get all orders (Admin) |
| PUT | /api/orders/:id/status | Update order status (Admin) |

### Reviews
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/reviews | Add review |
| GET | /api/reviews/:productId | Get product reviews |
| DELETE | /api/reviews/:id | Delete review |

---

## 🎨 Features

- ✅ JWT Authentication & Protected Routes
- ✅ Amazon-style UI with Tailwind CSS
- ✅ Redux Toolkit state management
- ✅ Product listing with search, filter, sort, pagination
- ✅ Shopping cart with quantity management
- ✅ Checkout with shipping address
- ✅ Order history & tracking
- ✅ Wishlist system
- ✅ Product reviews & star ratings
- ✅ Admin dashboard with analytics
- ✅ Cloudinary image upload
- ✅ Skeleton loading UI
- ✅ Toast notifications
- ✅ Fully responsive (mobile/tablet/desktop)
- ✅ Dark mode support
- ✅ Framer Motion animations

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React.js, Tailwind CSS, Redux Toolkit |
| Routing | React Router DOM v6 |
| HTTP | Axios |
| Animations | Framer Motion |
| Notifications | React Toastify |
| Icons | React Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Images | Cloudinary + Multer |

---

## 👨‍💻 Run Commands

```bash
# Backend (from /server)
npm run dev       # Development with nodemon
npm start         # Production

# Frontend (from /client)
npm start         # Development
npm run build     # Production build
```

---

## 📸 Pages

1. **Home** — Hero banner, categories, trending, flash sale, best sellers
2. **Login / Signup** — Form validation, JWT auth
3. **Products** — Filters, search, sort, pagination
4. **Product Detail** — Gallery, reviews, ratings, add to cart
5. **Cart** — Quantity update, remove, total
6. **Checkout** — Shipping address, order summary
7. **User Dashboard** — Profile, orders, wishlist
8. **Admin Dashboard** — Analytics, CRUD products/users/orders

---

*Built with ❤️ as a University Semester Project*
