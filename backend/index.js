require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const { limiter, requestLogger } = require('./middleware/security.middleware');

// Route imports
const authRoutes = require('./resources/auth/auth.router');
const faresRoutes = require('./resources/fares/fares.router');
const localitiesRoutes = require('./resources/localities/localities.router');
const vehicleTypesRoutes = require('./resources/vehicle-types/vehicleTypes.router');
const bookingsRoutes = require('./resources/bookings/bookings.router');
const paymentsRoutes = require('./resources/payments/payments.router');
const notificationsRoutes = require('./resources/notifications/notifications.router');
const adminRoutes = require('./resources/admin/admin.router');
const tripsRoutes = require('./resources/trips/trips.router');
// const vehiclesRoutes = require('./resources/vehicle-types/vehicleTypes.router');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(requestLogger);
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'PASSO Express API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fares', faresRoutes);
app.use('/api/localities', localitiesRoutes);
app.use('/api/vehicle-types', vehicleTypesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trips', tripsRoutes);
// app.use('/api/vehicles', vehiclesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;