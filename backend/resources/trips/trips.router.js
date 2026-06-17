const express = require('express');
const { body } = require('express-validator');
const tripsController = require('./trips.controller');
const { verifyToken, checkRole } = require('../../middleware/auth.middleware');

const router = express.Router();

// Validation
const createTripValidation = [
  body('routeId').isInt(),
  body('vehicleId').isInt(),
  body('departureTime').isISO8601(),
  body('estimatedArrival').isISO8601(),
];

const updateTripValidation = [
  body('status').isIn(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DELAYED']),
];

// Routes
router.post('/', verifyToken, checkRole(['ADMIN', 'OPERATOR']), createTripValidation, tripsController.createTrip);
router.get('/available', verifyToken, tripsController.getAvailableTrips);
router.put('/:tripId/status', verifyToken, checkRole(['ADMIN', 'OPERATOR']), updateTripValidation, tripsController.updateTripStatus);

module.exports = router;