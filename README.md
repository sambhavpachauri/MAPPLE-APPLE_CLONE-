# MAPPLE — Technology. Beautifully Simplified.

> A complete, production-grade premium consumer technology e-commerce platform built from scratch with Apple-inspired minimalist aesthetics, pixel-perfect micro-interactions, robust Python FastAPI backend, and dynamic React TypeScript frontend.

---

## 🌟 Overview & Highlights

- **Aesthetic Excellence:** Monochromatic palette (off-white `#fbfbfd`, pure white `#ffffff`, near-black `#1d1d1f`, soft borders `#e5e7eb`, and signature electric blue `#0071e3`), typography inspired by SF Pro / Inter, glassmorphism navigation with backdrop blur, and fluid hover states.
- **Enterprise-Grade Financial Precision:** All currency amounts across database, API calculations, and UI are modeled strictly as **integer paise** (1 INR = 100 paise) to eliminate floating-point calculation errors entirely.
- **Full-Stack Persistence:** No mock arrays. Powered by a relational database (SQLite local development fallback with absolute pathing, PostgreSQL ready for production) with SQLAlchemy ORM and Pydantic v2 schemas.
- **Authentication & Security:** Argon2id password hashing, stateless JWT authorization with role-based access control (`customer`, `admin`), plus automatic guest cart token merging upon user login.
- **Complete Multi-Step Checkout:** 5-step checkout (Review Bag ➔ Shipping Address ➔ Delivery Method ➔ Sandbox Payment Simulation ➔ Instant Confirmed Order Receipt).
- **Comprehensive Admin Suite:** Real-time analytics (Gross Revenue, Orders Count, Product Catalog, Low Stock alerts), Product inventory management with dynamic color/variant inspection, Order fulfillment status workflows, and Customer Support Helpdesk.

---

## 🔑 Demo Accounts & Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@mapple.com` | `MappleAdmin2026!` | Full Admin Dashboard (`/admin`), Product Editor, Order Status Manager, Support Tickets |
| **Customer Demo** | `alex@mapple.com` | `MappleCustomer2026!` | Order History, Saved Addresses, Profile, Wishlist, Checkout |

### 🏷️ Active Promotional Codes

- **`MAPPLE10`**: 10% discount on entire cart subtotal (minimum order ₹500).
- **`WELCOME5000`**: Flat ₹5,000 instant discount (minimum order ₹50,000).

---

## 📁 Repository Architecture

```
Mapple/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # RESTful route endpoints (auth, products, cart, checkout, admin, etc.)
│   │   ├── core/            # Configuration (pydantic-settings) & security (Argon2, JWT)
│   │   ├── db/              # SQLAlchemy session and Base metadata
│   │   ├── models/          # Relational entities (User, Product, Cart, Order, Address, etc.)
│   │   ├── schemas/         # Strict Pydantic v2 validation models
│   │   └── services/        # Business logic (cart pricing calculation, atomic order placement)
│   ├── alembic/             # Alembic database schema migrations
│   ├── tests/               # Pytest suite with FastAPI TestClient
│   ├── seed.py              # 20 realistic products, categories, colors, configs & users
│   ├── start_production.sh  # Automated migration + seed + uvicorn launcher
│   ├── Dockerfile           # Production container build
│   └── requirements.txt     # Locked dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Footer, ProductCard, SearchOverlay, BagPreview)
│   │   ├── contexts/        # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/           # 35+ full views (Store, Detail, Compare, Checkout, Admin, etc.)
│   │   ├── services/api.ts  # Typed API client with automatic token headers
│   │   ├── lib/utils.ts     # INR currency formatter (formatINR) and token utilities
│   │   └── test/            # Vitest & React Testing Library suites
│   ├── Dockerfile           # Multi-stage production Nginx container
│   ├── nginx.conf           # Reverse proxy configuration
│   ├── vercel.json          # Production Vercel SPA rewrites & caching
│   └── package.json         # React 19, Vite, Tailwind v4
├── render.yaml              # Render Cloud deployment blueprint
├── vercel.json              # Root Vercel SPA deployment configuration
├── docker-compose.yml       # 3-tier container orchestration (Postgres + Backend + Frontend)
├── start.sh                 # Single-command unified local development launcher
└── mapple.db                # Persistent SQLite database (local dev)
```

---

## 🧭 Page & Route Directory (35+ Views)

### Customer Facing
- `/` — **Homepage:** Editorial hero campaigns (Phone 16 Pro, MacBook Pro, iPad Pro, Watch Ultra), category carousel, key benefits, and comparison banner.
- `/store` — **The Mapple Store:** Complete product grid with category filtering, sort by price/rating/newest, and in-stock toggles.
- `/category/:slug` — **Category Showcase:** Specialized category landing pages (`smartphones`, `mac`, `tablets`, `watch`, `audio`, `accessories`).
- `/product/:slug` — **Product Detail Page:** High-res image gallery, interactive color picker, configuration options (Storage/RAM) with live price updates, full specifications matrix, and related recommendations.
- `/compare` — **Comparison Matrix:** Side-by-side spec comparisons across devices with feature highlights.
- `/search` — **Instant Search:** Full-text search with suggestions, live filtering, and query highlights.
- `/wishlist` — **Wishlist:** Saved products with quick-add to bag and instant sync.
- `/cart` — **Shopping Bag:** Line item quantity modifiers, promo code application, price breakdown, and delivery estimate.
- `/checkout` — **5-Step Checkout:** Guest/User information, delivery address, shipping method, and interactive sandbox payment simulator (Cards, UPI, NetBanking).
- `/order-success/:orderId` — **Order Confirmation:** Order summary, tracking ID, printable receipt, and delivery timeline.

### Customer Account Portal
- `/account` — **Account Dashboard:** Profile summary, quick stats, default address, and recent orders.
- `/account/orders` — **Order History:** Past orders list with status indicators and quick-view actions.
- `/account/orders/:orderId` — **Order Detail & Invoice:** Complete historical order breakdown with locked price snapshot.
- `/account/addresses` — **Address Book:** Manage, edit, and set default delivery addresses.
- `/account/profile` — **Profile Settings:** Update name, contact details, and password.
- `/login` & `/register` — **Authentication:** Secure login and account creation with instant cart merging.
- `/forgot-password` & `/reset-password` — **Password Recovery:** Flow with secure reset tokens.

### Customer Support & Information
- `/support` — **Support Hub:** Knowledge base, FAQ accordions, and support ticket creation.
- `/support/orders` — **Order Tracking:** Lookup order status directly with order number and email.
- `/about` — **Our Story:** Mapple philosophy, design values, and sustainability commitment.
- `/contact` — **Contact Us:** Store locator, contact information, and business hours.
- `/shipping-returns` — **Shipping & Returns Policy:** Transparent logistics and return windows.
- `/privacy` & `/terms` — **Legal & Terms:** Comprehensive privacy policy and terms of service.
- `*` — **404 Not Found:** Clean navigation back to the store.

### Administrator Portal
- `/admin` — **Executive Dashboard:** Live business metrics (Gross Revenue in INR, Order counts, Catalog volume, Low-stock warnings, and latest orders).
- `/admin/products` — **Product Management:** Searchable catalog with active stock levels, price badges, and variant counts.
- `/admin/orders` — **Order Fulfillment Workflow:** Filter orders by status, inspect customer details, and update status (`pending` ➔ `processing` ➔ `shipped` ➔ `delivered` ➔ `cancelled`).
- `/admin/support` — **Helpdesk Tickets:** Review incoming customer inquiries and update resolution status (`open` ➔ `in_progress` ➔ `resolved`).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+ (tested with Python 3.13)
- Node.js 18+ and npm
- (Optional) Docker and Docker Compose

---

### Method 1: Instant Local Startup (Recommended)

Run the unified startup script from the project root:

```bash
chmod +x start.sh
./start.sh
```

This will automatically:
1. Verify/create the backend Python virtual environment and install dependencies.
2. Initialize and seed the SQLite database with 20 premium products and demo accounts.
3. Launch the FastAPI backend on `http://localhost:8000`.
4. Launch the Vite frontend on `http://localhost:5173`.

Visit **http://localhost:5173** in your browser.

---

### Method 2: Manual Terminal Execution

#### Terminal 1 — Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```
Interactive API docs available at: **http://localhost:8000/docs**

#### Terminal 2 — Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend development server available at: **http://localhost:5173**

---

### Method 3: Docker Compose (PostgreSQL Production Stack)

To run the complete containerized stack with a real PostgreSQL database:

```bash
docker-compose up --build
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **PostgreSQL:** localhost:5432

---

## 🧪 Running Automated Tests

### Backend Test Suite (Pytest)
```bash
cd backend
./venv/bin/pytest tests/test_api.py -v
```
**Results:** `8 passed in 0.63s` (Health, Products List, Category Filtering, Product Detail, Cart API, Promo Code Validation, Support Ticket creation, Admin Auth Protection).

### Frontend Test Suite (Vitest)
```bash
cd frontend
npm test
```
**Results:** `2 test files passed, 7 tests passed` (INR Currency calculations, Token storage helpers, Tailwind utilities, ProductCard rendering & pricing).

### Frontend Production Build
```bash
cd frontend
npm run build
```
**Results:** Type checking (`tsc -b`) and Vite production bundle compile with 0 errors.

---

## 🛡️ License

Built with pride for MAPPLE. All rights reserved.
