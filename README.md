# DentaLink

A Django and React-powered dental supply procurement platform for distributors and clinics.  
This project demonstrates practical full-stack development skills including:

- Custom Django user roles for administrators, distributors, and clinics
- REST API development with Django REST Framework
- Dental product master management
- Live stock listing management with availability tracking
- Procurement order placement with automatic invoice calculation
- React + Vite frontend with real-time API integration

## 🚀 Features

- **Role-Based User System**: Custom authentication model with marketplace roles
- **Product Catalog**: Centralized dental product master for equipment and consumables
- **Live Price Listings**: Distributors can publish unit prices and stock availability
- **Order Management**: Clinics can place quantity-based procurement orders through the API
- **Auto Price Calculation**: Invoice totals are calculated automatically in the backend
- **Responsive Frontend**: Modern React interface for browsing listings and placing orders
- **Order Confirmation Flow**: Success state and stock refresh after a successful purchase

## 🛠️ Tech Stack

- **Backend**: Django 6, Django REST Framework
- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide React
- **Database**: PostgreSQL

## 🖼️ Screenshots

### Home Page

![DentaLink Home Page](demo/home_page.png)

### Place Order

![DentaLink Place Order Modal](demo/place_order.png)

### Order Success

![DentaLink Order Success State](demo/order_success.png)

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd dentalink
   ```

2. **Set up the backend environment:**
   ```bash
   cd backend
   python -m venv env
   env\Scripts\activate
   pip install django djangorestframework django-cors-headers django-environ psycopg2-binary
   ```

3. **Create the backend environment file** at `backend/core/.env`:
   ```env
   SECRET_KEY=your_secret_key
   DEBUG=True
   DATABASE_URL=postgres://username:password@localhost:5432/dentalink
   ```

4. **Run backend migrations and start the server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   Backend runs at: http://127.0.0.1:8000/

5. **Set up the frontend in a new terminal:**
   ```bash
   cd frontend
   npm install
   ```

6. **Create the frontend environment file** at `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

7. **Run the frontend development server:**
   ```bash
   npm run dev
   ```
   Frontend runs at: http://127.0.0.1:5173/

## 📁 Project Structure

```bash
dentalink/
├── backend/
│   ├── core/                  # Django project settings and routes
│   ├── dental_supply/         # Main app: models, serializers, views, URLs
│   └── manage.py              # Django management script
├── frontend/
│   ├── src/                   # React app source code
│   ├── public/                # Static frontend assets
│   └── package.json           # Frontend dependencies and scripts
├── demo/                      # README screenshots and demo images
└── README.md
```

## 🎯 Main API Endpoints

- **Products** (`/api/products/`) - List all dental products
- **Listings** (`/api/listings/`) - View or create distributor stock listings
- **Orders** (`/api/orders/`) - View or create procurement orders
- **Admin** (`/admin/`) - Django admin panel

## 🔑 Core Data Models

- **CustomUser**: Role-based user model for administrators, distributors, and clinics
- **DentalProduct**: Product master with equipment name and category
- **VendorStockListing**: Distributor listings with unit price, availability, and quantity
- **ProcurementOrder**: Clinic order model with automatic total invoice calculation

## 📌 Notes

- The backend reads its environment variables from `backend/core/.env`.
- The frontend expects the API base URL in `frontend/.env`.
- Orders automatically reduce listing stock when created.

---

⭐ If this project helps you, consider starring the repository.