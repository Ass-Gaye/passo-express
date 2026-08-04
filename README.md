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

## Implementation Roadmap

This step-by-step roadmap is designed to move the project forward reliably and create a production-ready transport booking system.

### Step 1: Setup and baseline validation
1. Install backend dependencies and run `npm install` in `backend`.
2. Configure `.env` with `DATABASE_URL`, `JWT_SECRET`, email, and Stripe keys.
3. Run Prisma migrations: `npx prisma migrate dev --name init`.
4. Seed initial localities, vehicle types, and fares using `node prisma/seed.js`.
5. Start the backend and verify `/health` returns `status: OK`.

### Step 2: Ensure authentication works end to end
1. Confirm `POST /api/auth/register` creates users and returns a JWT.
2. Confirm `POST /api/auth/login` validates password and returns token and user data.
3. Ensure the frontend stores `token` and `user` in `localStorage` in `frontend/src/pages/Auth.jsx`.
4. Verify protected routes use `frontend/src/components/ProtectedRoute.jsx` and redirect unauthenticated users to `/auth`.
5. Confirm the auth redirect preserves the original target route for booking flows.

### Step 3: Build trip search and availability
1. Implement `/api/trips/available` in `backend/resources/trips/trips.controller.js`.
2. Query trips by `fromLocalityId`, `toLocalityId`, and `date`.
3. Include `vehicle`, `route`, and confirmed bookings to calculate available seats.
4. Return only trips with open seats to the frontend.
5. Wire the React search page in `frontend/src/pages/SearchTrips.jsx` to show available trips and seat counts.

### Step 4: Bookings and seat management
1. Add `POST /api/bookings` in `backend/resources/bookings/bookings.controller.js`.
2. Validate authenticated passengers using `verifyToken` and `checkUserStatus`.
3. Check trip capacity and prevent booking if the trip is full.
4. Use Prisma transaction logic to create booking and increment `Trip.occupiedSeats`.
5. Build the booking page in `frontend/src/pages/Booking.jsx` and disable booking when seats are unavailable.

### Step 5: Payment and booking confirmation
1. Implement payment intent creation in `backend/resources/payments/payments.controller.js`.
2. Confirm payment endpoint updates booking and payment status.
3. Redirect users after successful booking to `frontend/src/pages/Payment.jsx`.
4. Store booking confirmation and payment history for passengers.
5. Add notification creation for booking confirmation events.

### Step 6: Passenger dashboard and management
1. Build `/api/bookings` GET for passenger booking history.
2. Add cancellation via `DELETE /api/bookings/:bookingId`.
3. Implement booking filters and pagination in the `UserBookings` page.
4. Use `frontend/src/pages/UserBookings.jsx` to display booking status and action buttons.
5. Keep booking and payment records linked for easy auditing.

### Step 7: Admin and operator tools
1. Expose admin routes in `backend/resources/admin/admin.router.js`.
2. Add trip creation and status updates in `backend/resources/trips/trips.router.js`.
3. Build admin UI pages for fares, localities, vehicle types, and trips.
4. Add role-based access in `frontend/src/App.jsx` and `ProtectedRoute.jsx`.
5. Create admin / operator pages to update trip status and monitor bookings.

### Step 8: Notifications and real-time updates
1. Create notification records in `backend/resources/notifications/notifications.controller.js`.
2. Add unread counts and read/unread endpoints.
3. Configure Socket.IO on the backend and frontend for real-time updates.
4. Surface booking confirmations and trip status changes in `frontend/src/pages/NotificationsCenter.jsx`.
5. Show active vehicle location updates on the frontend map if available.

### Step 9: Advanced transport improvements
1. Add driver assignment logic to match trips with drivers and vehicles.
2. Introduce capacity/queue management for busy routes.
3. Implement peak-hour pricing and fare update notifications.
4. Add route optimization support for better scheduling.
5. Expand analytics and reporting for admin usage.

### Step 10: Test, deploy, and monitor
1. Add unit and integration tests for auth, booking, trips, and payments.
2. Set up CI/CD with linting and test execution.
3. Harden production config and environment variable management.
4. Add logging, health checks, and monitoring alerts.
5. Prepare deployment documentation and release checklists.

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