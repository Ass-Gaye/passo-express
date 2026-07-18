const express = require('express');
const { body } = require('express-validator');
const vehiclesController = require('./vehicleTypes.controller');
const { verifyToken, checkRole } = require('../../middleware/auth.middleware');

const router = express.Router();

// Validation
const updateLocationValidation = [
  body('vehicleId').isInt(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
  body('speed').optional().isFloat(),
  body('accuracy').optional().isFloat(),
];

// Routes
router.get('/', vehiclesController.getVehicleTypes);
router.post('/location/update', verifyToken, checkRole(['DRIVER', 'OPERATOR']), updateLocationValidation, vehiclesController.updateVehicleLocation);
router.get('/:vehicleId/history', verifyToken, vehiclesController.getLocationHistory);
router.get('/:vehicleId/status', verifyToken, vehiclesController.getVehicleStatus);

module.exports = router;