# PASSO Express - Complete API Documentation

## Overview

PASSO Express is a modern full-stack transport fare management system built for managing transport routes, fares, localities, vehicle types, bookings, and real-time vehicle tracking across The Gambia.

## Features Implemented

### ✅ Phase 1 - Core Foundation
- ✅ Authentication (Register, Login, JWT)
- ✅ Authorization (Role-based access control)
- ✅ Admin Dashboard (Statistics & user management)
- ✅ Booking System (Trip booking & management)
- ✅ Payment Integration (Stripe)
- ✅ Notifications (Real-time alerts)
- ✅ GPS Tracking (Vehicle location)
- ✅ Real-time Updates (WebSocket)

## Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS
- React Router DOM
- Axios
- Framer Motion
- React Leaflet
- Socket.IO Client (for real-time updates)

### Backend
- Node.js
- Express.js 5
- PostgreSQL
- Prisma ORM
- JWT (Authentication)
- Stripe (Payments)
- Socket.IO (Real-time)
- Nodemailer (Email)

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| POST | /api/auth/register | Register new user | ❌ |
| POST | /api/auth/login | Login user | ❌ |
| GET | /api/auth/me | Get current user | ✅ |
| PUT | /api/auth/profile | Update user profile | ✅ |

### Fares

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| GET | /api/fares | Get all fares | ❌ |
| GET | /api/fares/:id | Get single fare | ❌ |
| POST | /api/fares | Create fare | ✅ Admin |
| PUT | /api/fares/:id | Update fare | ✅ Admin |
| DELETE | /api/fares/:id | Delete fare | ✅ Admin |

### Localities

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| GET | /api/localities | Get all localities | ❌ |
| GET | /api/localities/:id | Get single locality | ❌ |
| POST | /api/localities | Create locality | ✅ Admin |

### Vehicle Types

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| GET | /api/vehicle-types | Get all vehicle types | ❌ |
| GET | /api/vehicle-types/:id | Get single vehicle type | ❌ |
| POST | /api/vehicle-types | Create vehicle type | ✅ Admin |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| POST | /api/bookings | Create booking | ✅ Passenger |
| GET | /api/bookings | Get user bookings | ✅ Passenger |
| DELETE | /api/bookings/:bookingId | Cancel booking | ✅ Passenger |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| POST | /api/payments/intent | Create payment intent | ✅ Passenger |
| POST | /api/payments/confirm | Confirm payment | ✅ Passenger |
| GET | /api/payments/history | Get payment history | ✅ Passenger |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| GET | /api/notifications | Get notifications | ✅ |
| GET | /api/notifications/unread/count | Get unread count | ✅ |
| PUT | /api/notifications/:notificationId/read | Mark as read | ✅ |
| PUT | /api/notifications/read-all | Mark all as read | ✅ |
| DELETE | /api/notifications/:notificationId | Delete notification | ✅ |

### Trips

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| POST | /api/trips | Create trip | ✅ Admin/Operator |
| GET | /api/trips/available | Get available trips | ✅ |
| PUT | /api/trips/:tripId/status | Update trip status | ✅ Admin/Operator |

### Vehicles & GPS Tracking

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| POST | /api/vehicles/location/update | Update vehicle location | ✅ Driver/Operator |
| GET | /api/vehicles/:vehicleId/history | Get location history | ✅ |
| GET | /api/vehicles/:vehicleId/status | Get vehicle status | ✅ |

### Admin Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------|
| GET | /api/admin/dashboard/stats | Get dashboard statistics | ✅ Admin |
| GET | /api/admin/users | Get all users | ✅ Admin |
| PUT | /api/admin/users/:userId/status | Update user status | ✅ Admin |
| GET | /api/admin/reports/daily | Get daily reports | ✅ Admin |

## User Roles

- **SUPER_ADMIN**: Full system access, can manage admins and all settings
- **ADMIN**: Manage fares, routes, trips, users
- **OPERATOR**: Manage their vehicles and trips
- **DRIVER**: Drive vehicles and update locations
- **PASSENGER**: Book trips and make payments

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/passo_express

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Socket.IO
SOCKET_IO_PORT=3001
```

## Installation & Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database (optional)
node prisma/seed.js

# Start development server
npm run dev
```

Backend runs on: `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Real-Time Features

### WebSocket Events

**Vehicle Location Updates:**
```javascript
socket.on('vehicle-location', (data) => {
  // data: { vehicleId, latitude, longitude, speed }
});
```

**Trip Status Updates:**
```javascript
socket.on('trip-status-update', (data) => {
  // data: { tripId, status, message }
});
```

**Notifications:**
```javascript
socket.on('notification', (data) => {
  // data: { type, title, message }
});
```

## Database Schema

### User Model
- Stores user information
- Role-based access control
- Account status tracking

### Booking Model
- Trip reservations
- Seat management
- Payment tracking

### Payment Model
- Payment processing
- Transaction history
- Multiple payment methods support

### Trip Model
- Trip scheduling
- Real-time status updates
- Passenger management

### Vehicle Model
- Vehicle tracking
- Location history
- Status management

### Notification Model
- User notifications
- Read status tracking
- Multiple notification types

## Security Features

- ✅ JWT Authentication
- ✅ Password hashing (bcryptjs)
- ✅ Role-based authorization
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Environment variables for secrets

## Future Enhancements

- 🔄 Route optimization algorithm
- 🔄 Passenger rating system
- 🔄 Surge pricing during peak hours
- 🔄 SMS notifications
- 🔄 Mobile app (React Native)
- 🔄 Analytics dashboard
- 🔄 Multi-language support
- 🔄 Offline mode support

## Project Structure

```
passo-express/
├── backend/
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── resources/
│   │   ├── auth/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── notifications/
│   │   ├── admin/
│   │   ├── trips/
│   │   ├── vehicles/
│   │   ├── fares/
│   │   ├── localities/
│   │   └── vehicle-types/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── index.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Support

For support, email support@passoexpress.com or open an issue on GitHub.

## License

ISC License - See LICENSE file for details

## Author

HageTech

Built with ❤️ for The Gambia's transport sector