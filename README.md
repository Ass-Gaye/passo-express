# PASSO Express

PASSO Express is a modern full-stack transport fare management system built for managing transport routes, fares, localities, and vehicle types across The Gambia.

The application allows users to:
- view transport fares,
- create new fares,
- update and delete fares,
- browse localities,
- explore routes visually on a map,
- analyze transport statistics through dashboards.

---

# Tech Stack

## Frontend

- React
- Vite
- TailwindCSS
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- React Leaflet
- Leaflet

---

## Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- dotenv
- nodemon

---

# Features

## Frontend Features

- Modern responsive UI
- Dark / Light mode
- Mobile responsive navigation
- Search and filtering
- Pagination
- Animated cards
- Interactive transport map
- Dashboard analytics
- CRUD operations for fares
- Localities listing
- Responsive layouts

---

## Backend Features

- RESTful API
- MVC architecture
- Modular resource structure
- PostgreSQL integration
- Prisma ORM
- CRUD endpoints
- Error handling
- Database seeding

---

# Project Structure

```text
passo-express/
│
├── backend/
│
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── resources/
│   │
│   │   ├── fares/
│   │   │   ├── fares.controller.js
│   │   │   ├── fares.db.js
│   │   │   └── fares.router.js
│   │   │
│   │   ├── localities/
│   │   │   ├── localities.controller.js
│   │   │   ├── localities.db.js
│   │   │   └── localities.router.js
│   │   │
│   │   └── vehicle-types/
│   │       ├── vehicleTypes.controller.js
│   │       ├── vehicleTypes.db.js
│   │       └── vehicleTypes.router.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── .env
│   ├── index.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│
│   ├── src/
│   │
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── FareCard.jsx
│   │   │   ├── MapView.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Fares.jsx
│   │   │   ├── CreateFare.jsx
│   │   │   ├── EditFare.jsx
│   │   │   ├── Localities.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── fares.service.js
│   │   │   ├── localities.service.js
│   │   │   └── vehicleTypes.service.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

# Installation

---

# Clone Repository

```bash
git clone <repository-url>
```

---

# Navigate Into Project

```bash
cd passo-express
```

---

# Backend Setup

---

# Navigate Into Backend

```bash
cd backend
```

---

# Install Dependencies

```bash
npm install
```

---

# Install Required Backend Packages

```bash
npm install express prisma @prisma/client dotenv cors morgan
```

---

# Install Development Dependencies

```bash
npm install -D nodemon
```

---

# Setup PostgreSQL Database

Create a PostgreSQL database using pgAdmin or PostgreSQL CLI.

Example database name:

```text
passo_express
```

---

# Configure Environment Variables

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/passo_express"

PORT=3000
```

Replace:
- `postgres`
- `password`
- database name

with your own PostgreSQL credentials.

---

# Run Prisma Migration

```bash
npx prisma migrate dev
```

---

# Generate Prisma Client

```bash
npx prisma generate
```

---

# Seed Database

```bash
node prisma/seed.js
```

---

# Start Backend Server

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

---

# Frontend Setup

---

# Open New Terminal

```bash
cd frontend
```

---

# Install Dependencies

```bash
npm install
```

---

# Install Frontend Packages

```bash
npm install react-router-dom axios framer-motion lucide-react react-leaflet leaflet
```

---

# Install TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

---

# Create Tailwind Config

```bash
npx tailwindcss init -p
```

---

# Configure Tailwind

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */

export default {

  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {},
  },

  plugins: [],
}
```

---

# Configure CSS

## src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

# Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# API Endpoints

---

# Fares

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/fares | Get all fares |
| GET | /api/fares/:id | Get one fare |
| POST | /api/fares | Create fare |
| PUT | /api/fares/:id | Update fare |
| DELETE | /api/fares/:id | Delete fare |

---

# Localities

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/localities | Get all localities |
| POST | /api/localities | Create locality |
| GET | /api/localities/:id | Get locality |

---

# Vehicle Types

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/vehicleTypes | Get all vehicle types |
| POST | /api/vehicleTypes | Create vehicle type |
| GET | /api/vehicleTypes/:id | Get vehicle type |

---

# Dark Mode

The application supports:
- Light mode
- Dark mode

Toggle available in navbar.

---

# Map Integration

PASSO Express uses:
- React Leaflet
- OpenStreetMap

for:
- transport visualization,
- locality mapping,
- route exploration.

---

# Future Improvements

- Authentication
- Authorization
- Admin dashboard
- GPS tracking
- Real-time vehicle movement
- Booking system
- Passenger management
- Notifications
- Route optimization
- Payment integration

---

# Author
HageTech


Built using:
- React
- Express
- PostgreSQL
- Prisma ORM
- TailwindCSS

