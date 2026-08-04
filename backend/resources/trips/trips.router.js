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
  body('routeId').optional().isInt(),
  body('vehicleId').optional().isInt(),
  body('departureTime').optional().isISO8601(),
  body('estimatedArrival').optional().isISO8601(),
  body('status').optional().isIn(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DELAYED']),
];

const updateTripStatusValidation = [
  body('status').isIn(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DELAYED']),
];

// Routes
router.post('/', verifyToken, checkRole(['ADMIN', 'OPERATOR']), createTripValidation, tripsController.createTrip);
router.get('/routes', tripsController.getRoutes);
router.get('/vehicles', tripsController.getVehicles);
router.get('/', tripsController.getAllTrips);
router.get('/available', tripsController.getAvailableTrips);
router.put('/:tripId', verifyToken, checkRole(['ADMIN', 'OPERATOR']), updateTripValidation, tripsController.updateTrip);
router.put('/:tripId/status', verifyToken, checkRole(['ADMIN', 'OPERATOR']), updateTripStatusValidation, tripsController.updateTripStatus);
router.delete('/:tripId', verifyToken, checkRole(['ADMIN', 'OPERATOR']), tripsController.deleteTrip);
router.get('/:tripId', tripsController.getTripById);

module.exports = router;