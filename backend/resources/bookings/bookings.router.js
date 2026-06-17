const express = require('express');
const { body } = require('express-validator');
const bookingsController = require('./bookings.controller');
const { verifyToken, checkUserStatus } = require('../../middleware/auth.middleware');

const router = express.Router();

// Validation
const createBookingValidation = [
  body('tripId').isInt().withMessage('Trip ID is required'),
  body('fareId').isInt().withMessage('Fare ID is required'),
  body('seatNumber').optional().isString(),
];

// Routes
router.post('/', verifyToken, checkUserStatus, createBookingValidation, bookingsController.createBooking);
router.get('/', verifyToken, checkUserStatus, bookingsController.getUserBookings);
router.delete('/:bookingId', verifyToken, checkUserStatus, bookingsController.cancelBooking);

module.exports = router;