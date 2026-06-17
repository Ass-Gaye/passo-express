# PASSO Express - Implementation Guide

## 🚀 Quick Start

This guide walks you through setting up and running PASSO Express locally.

## Prerequisites

- Node.js 16+ installed
- PostgreSQL 12+ running locally or remote
- Git installed
- A text editor (VS Code recommended)

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/passo_express"

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Socket.IO
SOCKET_IO_PORT=3001
```

### 4. Create PostgreSQL Database

Using psql or pgAdmin:

```sql
CREATE DATABASE passo_express;
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate Prisma client

### 6. Seed Database (Optional)

```bash
node prisma/seed.js
```

This populates test data for development.

### 7. Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 PASSO Express API running on port 3000
🏢 Socket.IO server ready for real-time updates
🌍 Frontend URL: http://localhost:5173
```

## Frontend Setup

### 1. Open New Terminal, Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (Optional)

Create `.env` in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Testing the Application

### 1. Create Test Account

1. Go to `http://localhost:5173`
2. Click "Sign Up"
3. Fill in details and submit
4. You'll be redirected to the appropriate dashboard based on your role

### 2. Test Authentication

- **Register**: `/auth` page (Sign Up tab)
- **Login**: `/auth` page (Sign In tab)
- Tokens are stored in localStorage

### 3. Test Bookings

1. Search for trips at `/search-trips`
2. Select a trip and proceed to booking
3. Complete payment process
4. View bookings at `/my-bookings`

### 4. Test Admin Features

1. Login with an ADMIN or SUPER_ADMIN account
2. Access admin dashboard
3. View and manage users
4. Check statistics and reports

## API Testing with cURL

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "+220 123 4567",
    "role": "PASSENGER"
  }'
```

### Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Fares

```bash
curl -X GET http://localhost:3000/api/fares
```

### Search Available Trips

```bash
curl -X GET "http://localhost:3000/api/trips/available?fromLocalityId=1&toLocalityId=2&date=2026-06-20"
```

### Create Booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": 1,
    "fareId": 1,
    "seatNumber": "A1"
  }'
```

## Project Structure

```
passo-express/
├── backend/
│   ├── middleware/
│   │   └── auth.middleware.js          # JWT & Role-based auth
│   ├── resources/
│   │   ├── auth/                       # Authentication
│   │   ├── bookings/                   # Booking management
│   │   ├── payments/                   # Payment processing
│   │   ├── notifications/              # Notifications
│   │   ├── admin/                      # Admin dashboard
│   │   ├── trips/                      # Trip management
│   │   ├── vehicles/                   # Vehicle tracking
│   │   ├── fares/                      # Fare management
│   │   ├── localities/                 # Locality management
│   │   └── vehicle-types/              # Vehicle type management
│   ├── prisma/
│   │   ├── schema.prisma               # Database schema
│   │   └── seed.js                     # Database seeding
│   ├── index.js                        # Express app setup
│   ├── server.js                       # Server with Socket.IO
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx                # Login/Register
│   │   │   ├── SearchTrips.jsx         # Trip search
│   │   │   ├── Booking.jsx             # Booking page
│   │   │   ├── UserBookings.jsx        # My bookings
│   │   │   ├── AdminDashboard.jsx      # Admin stats
│   │   │   └── NotificationsCenter.jsx # Notifications
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Database Schema Overview

### User
- Authentication and authorization
- Role-based access control
- Account status tracking

### Booking
- Trip reservations
- Seat management
- Payment tracking

### Payment
- Payment processing via Stripe
- Transaction history
- Multiple payment methods

### Trip
- Trip scheduling
- Real-time status updates
- Passenger management

### Vehicle
- Vehicle tracking
- Location history
- Status management

### Notification
- User notifications
- Read status tracking
- Multiple notification types

## Features by User Role

### Passenger (PASSENGER)
- ✅ Search and book trips
- ✅ Make payments
- ✅ View booking history
- ✅ Receive notifications
- ✅ Track trip in real-time
- ✅ Cancel bookings

### Driver (DRIVER)
- ✅ Update vehicle location (GPS)
- ✅ View assigned trips
- ✅ Update trip status
- ✅ Communicate with passengers

### Operator (OPERATOR)
- ✅ Manage vehicles
- ✅ Create and manage trips
- ✅ View earnings
- ✅ Manage drivers
- ✅ View passenger bookings

### Admin (ADMIN)
- ✅ Manage all fares
- ✅ Manage all routes
- ✅ Manage users
- ✅ View statistics
- ✅ Generate reports
- ✅ Approve/reject changes

### Super Admin (SUPER_ADMIN)
- ✅ All Admin permissions
- ✅ Manage administrators
- ✅ System settings
- ✅ Global configurations

## Real-Time Features (WebSocket)

### Vehicle Location Updates
```javascript
// Client listening
socket.on('vehicle-location', (data) => {
  // data: { vehicleId, latitude, longitude, speed }
});

// Server emitting
io.to('vehicle-1').emit('vehicle-location', locationData);
```

### Trip Status Updates
```javascript
// Client listening
socket.on('trip-status-update', (data) => {
  // data: { tripId, status, message }
});
```

### Notifications
```javascript
// Client listening
socket.on('notification', (data) => {
  // data: { type, title, message }
});
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Port Already in Use
```bash
# Linux/Mac: Find process on port 3000
lsof -i :3000
# Kill process
kill -9 <PID>

# Windows: Find process on port 3000
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F
```

### JWT Token Expired
- Clear localStorage and login again
- Or refresh token using refresh token endpoint (to be implemented)

### Email Not Sending
- Verify email credentials in .env
- For Gmail: Use App Password (not regular password)
- Enable "Less secure app access" if using regular Gmail

## Deployment

### Backend Deployment (Heroku Example)

```bash
heroku create passo-express-api
git push heroku main
heroku config:set JWT_SECRET=your-secret
heroku config:set STRIPE_SECRET_KEY=your-key
```

### Frontend Deployment (Vercel Example)

```bash
npm install -g vercel
cd frontend
vercel
```

## Security Best Practices

1. ✅ Use HTTPS in production
2. ✅ Store JWT in httpOnly cookies
3. ✅ Validate all inputs
4. ✅ Use environment variables for secrets
5. ✅ Implement rate limiting
6. ✅ Use CORS properly
7. ✅ Keep dependencies updated
8. ✅ Implement CSRF protection
9. ✅ Use prepared statements (Prisma does this)
10. ✅ Implement request logging

## Performance Tips

1. Use database indexes on frequently queried fields
2. Implement pagination for large datasets
3. Cache frequently accessed data
4. Compress API responses
5. Use CDN for static assets
6. Implement database connection pooling
7. Monitor API response times

## Future Enhancements

- 🔄 Route optimization algorithm
- 👥 Passenger rating system
- 💰 Dynamic surge pricing
- 📱 SMS notifications (for offline users)
- 📱 Mobile app (React Native)
- 📊 Advanced analytics dashboard
- 🌍 Multi-language support
- 📴 Offline mode support
- 🔐 Two-factor authentication
- 🤖 AI-powered recommendations

## Support & Contributing

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Fork and create pull requests for contributions

## License

ISC License - See LICENSE file

## Contact

For support: support@passoexpress.com
Author: HageTech
